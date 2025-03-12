import { useState, useEffect } from "react";
import { useGraphContext } from "@/contexts/GraphContext";
import { useThreadContext } from "@/contexts/ThreadProvider";
import { useUserContext } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Thread as ThreadType } from "@langchain/langgraph-sdk";
import { ALL_MODEL_NAMES, DEFAULT_MODEL_CONFIG, DEFAULT_MODEL_NAME } from "@opencanvas/shared/models";
import { CustomModelConfig } from "@opencanvas/shared/types";

export function useThreadManager() {
  const { graphData } = useGraphContext();
  const { setModelName, setModelConfig } = useThreadContext();
  const { setArtifact, chatStarted, setChatStarted } = graphData;
  const { toast } = useToast();
  const { user } = useUserContext();
  const { setThreadId } = useThreadContext();

  const handleQuickStart = (type: "text") => {
    setChatStarted(true);
    setSelectedThread(undefined);
  };

  const switchSelectedThreadCallback = (thread: ThreadType) => {
    if ((thread.values as Record<string, any>)?.messages?.length) {
      setChatStarted(true);
      if (thread?.metadata?.customModelName) {
        setModelName(thread.metadata.customModelName as ALL_MODEL_NAMES);
      } else {
        setModelName(DEFAULT_MODEL_NAME);
      }

      if (thread?.metadata?.modelConfig) {
        setModelConfig(
          (thread?.metadata?.customModelName ?? DEFAULT_MODEL_NAME) as ALL_MODEL_NAMES,
          (thread.metadata?.modelConfig ?? DEFAULT_MODEL_CONFIG) as CustomModelConfig
        );
      } else {
        setModelConfig(DEFAULT_MODEL_NAME, DEFAULT_MODEL_CONFIG);
      }
    } else {
      setChatStarted(false);
    }
  };

  const handleNewSession = async () => {
    if (!user) {
      toast({
        title: "User not found",
        description: "Failed to create thread without user",
        duration: 5000,
        variant: "destructive",
      });
      return;
    }

    setThreadId(null);
    setModelName(modelName);
    setModelConfig(modelName, modelConfig);
    clearState();
    setChatStarted(false);
  };

  return {
    handleQuickStart,
    switchSelectedThreadCallback,
    handleNewSession,
  };
}