import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createEdgeAiHandler } from "../_shared/edgeAi.ts";

serve(createEdgeAiHandler("ml-fraud-detection"));
