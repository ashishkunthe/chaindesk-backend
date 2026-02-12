import { Request, Router } from "express";
import {
  actionArrayTypes,
  transcriptTypes,
  updateActionTypes,
} from "../types/transcript";
import { ActionItem, Transcript } from "../model/Transcript";
import { authMiddleware } from "../services/authMiddleware";
import { generateTranscript } from "../services/genrateTranscript";
import mongoose from "mongoose";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const route = Router();

interface RequestExtended extends Request {
  userId: string;
}
route.post("/transcript", authMiddleware as any, async (req, res) => {
  const input = transcriptTypes.safeParse(req.body);
  const request = req as RequestExtended;
  const userId = request.userId;

  if (!input.success) {
    return res.status(400).json({
      message: "Input validation error",
    });
  }

  try {
    const { transcript } = input.data;

    const newTranscript = await Transcript.create({
      rawTranscript: transcript,
      userId,
    });

    const llmResponse = await generateTranscript(transcript);

    const parsed = actionArrayTypes.safeParse(llmResponse);

    if (!parsed.success) {
      return res.status(500).json({
        message: "LLM output validation failed",
      });
    }

    const actionItemsToInsert = parsed.data.map((item: any) => ({
      transcriptId: newTranscript._id,
      task: item.task,
      owner: item.owner ?? null,
      dueDate: item.dueDate ? new Date(item.dueDate) : null,
      summary: item.summary,
    }));

    await ActionItem.insertMany(actionItemsToInsert);

    res.status(201).json({
      message: "Transcript processed successfully",
      transcriptId: newTranscript._id,
      actionItems: actionItemsToInsert,
    });
  } catch (error) {
    console.error("Error processing transcript:", error);
    res.status(500).json({
      message: "Error processing transcript",
    });
  }
});

route.get("/transcript", authMiddleware as any, async (req, res) => {
  const request = req as RequestExtended;
  const userId = request.userId;

  try {
    const transcripts = await Transcript.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("rawTranscript createdAt _id");

    res.status(200).json({
      transcripts,
    });
  } catch (error) {
    console.error("Error getting transcripts", error);
    res.status(500).json({
      message: "Error getting transcripts",
    });
  }
});

route.get("/transcript/:id", authMiddleware as any, async (req, res) => {
  // @ts-ignore
  const request = req as RequestExtended;
  const userId = request.userId;
  const transcriptId = req.params.id;

  try {
    const transcript = await Transcript.findOne({
      _id: transcriptId,
      userId,
    });

    if (!transcript) {
      return res.status(404).json({
        message: "Transcript not found",
      });
    }

    const actions = await ActionItem.find({ transcriptId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      transcript: {
        id: transcript._id,
        rawTranscript: transcript.rawTranscript,
        createdAt: transcript.createdAt,
      },
      actionItems: actions,
    });
  } catch (error) {
    console.error("Error fetching transcript details:", error);
    res.status(500).json({
      message: "Error fetching transcript details",
    });
  }
});

route.put("/action/:id", authMiddleware as any, async (req, res) => {
  // @ts-ignore
  const request = req as RequestExtended;
  const userId = request.userId;
  const actionId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(actionId)) {
    return res.status(400).json({ message: "Invalid action ID" });
  }

  const parsed = updateActionTypes.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const action = await ActionItem.findById(actionId);

    if (!action) {
      return res.status(404).json({ message: "Action not found" });
    }

    const transcript = await Transcript.findOne({
      _id: action.transcriptId,
      userId,
    });

    if (!transcript) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await ActionItem.findByIdAndUpdate(
      actionId,
      {
        ...parsed.data,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Action updated",
      action: updated,
    });
  } catch (error) {
    console.error("Error updating action:", error);
    res.status(500).json({ message: "Server error" });
  }
});

route.delete("/action/:id", authMiddleware as any, async (req, res) => {
  // @ts-ignore
  const request = req as RequestExtended;
  const userId = request.userId;
  const actionId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(actionId)) {
    return res.status(400).json({ message: "Invalid action ID" });
  }

  try {
    const action = await ActionItem.findById(actionId);

    if (!action) {
      return res.status(404).json({ message: "Action not found" });
    }

    const transcript = await Transcript.findOne({
      _id: action.transcriptId,
      userId,
    });

    if (!transcript) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await ActionItem.findByIdAndDelete(actionId);

    res.status(200).json({
      message: "Action deleted",
    });
  } catch (error) {
    console.error("Error deleting action:", error);
    res.status(500).json({ message: "Server error" });
  }
});

route.get("/status", async (req, res) => {
  const status = {
    backend: "ok",
    database: "unknown",
    llm: "unknown",
  };

  try {
    // @ts-ignore
    await mongoose.connection.db.admin().ping();
    status.database = "ok";
  } catch (error) {
    status.database = "error";
  }

  try {
    const test = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Reply with OK" }],
      max_tokens: 5,
    });

    if (test.choices?.length) {
      status.llm = "ok";
    } else {
      status.llm = "error";
    }
  } catch (error) {
    status.llm = "error";
  }

  res.status(200).json(status);
});

route.delete("/transcript/:id", authMiddleware as any, async (req, res) => {
  // @ts-ignore
  const request = req as RequestExtended;
  const userId = request.userId;
  const transcriptId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(transcriptId)) {
    return res.status(400).json({ message: "Invalid transcript ID" });
  }

  try {
    const transcript = await Transcript.findOne({
      _id: transcriptId,
      userId,
    });

    if (!transcript) {
      return res.status(404).json({
        message: "Transcript not found",
      });
    }

    await ActionItem.deleteMany({ transcriptId });

    await Transcript.findByIdAndDelete(transcriptId);

    res.status(200).json({
      message: "Transcript and related action items deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting transcript:", error);
    res.status(500).json({
      message: "Server error while deleting transcript",
    });
  }
});

export default route;
