import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { AutoModelForCausalLM, AutoTokenizer } from '@huggingface/transformers';

class QwenChatbot {
    private tokenizer;
    private model;
    private history: { role: string; content: string }[];

    private constructor(tokenizer: any, model: any) {
        this.tokenizer = tokenizer;
        this.model = model;
        this.history = [];
    }

    static async create(modelName = "Qwen/Qwen3-0.6B") {
        const tokenizer = await AutoTokenizer.from_pretrained(modelName);
        const model = await AutoModelForCausalLM.from_pretrained(modelName);
        return new QwenChatbot(tokenizer, model);
    }
}