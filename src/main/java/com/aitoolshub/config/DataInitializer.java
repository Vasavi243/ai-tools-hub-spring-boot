package com.aitoolshub.config;

import com.aitoolshub.model.Tool;
import com.aitoolshub.repository.ToolRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ToolRepository toolRepository;

    public DataInitializer(ToolRepository toolRepository) {
        this.toolRepository = toolRepository;
    }

    @Override
    public void run(String... args) {
        if (toolRepository.count() == 0) {
            List<Tool> initialTools = Arrays.asList(
                new Tool(
                    null,
                    "ChatGPT",
                    "State-of-the-art conversational AI model developed by OpenAI capable of reasoning, writing, coding, and problem solving across diverse topics.",
                    "Chatbots",
                    "https://chatgpt.com",
                    "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
                    "Freemium",
                    "Natural Language Processing, Code Generation, File Analysis, Custom GPTs, Multi-modal Vision",
                    LocalDateTime.now().minusDays(30)
                ),
                new Tool(
                    null,
                    "Claude 3",
                    "Anthropic's flagship AI model family known for superior reasoning, long-context analysis (200k+ tokens), high precision, and safety-focused responses.",
                    "Research",
                    "https://claude.ai",
                    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
                    "Freemium",
                    "200K Context Window, Vision Analysis, Code Writing, PDF Analysis, Enterprise Safety",
                    LocalDateTime.now().minusDays(25)
                ),
                new Tool(
                    null,
                    "GitHub Copilot",
                    "AI pair programmer that embeds directly into standard IDEs to auto-suggest functions, complete code blocks, generate tests, and refactor code.",
                    "Coding",
                    "https://github.com/features/copilot",
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
                    "Paid",
                    "IDE Integration, Context-aware Code Autocomplete, Chat Assistance, Multi-language Support",
                    LocalDateTime.now().minusDays(20)
                ),
                new Tool(
                    null,
                    "Midjourney",
                    "Independent research lab producing AI image generation systems that produce photorealistic, hyper-detailed visual artwork from textual prompts.",
                    "Image Generation",
                    "https://midjourney.com",
                    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80",
                    "Paid",
                    "Photorealistic Image Synthesis, Style Mimicry, Upscaling, Outpainting, Parameter Fine-tuning",
                    LocalDateTime.now().minusDays(18)
                ),
                new Tool(
                    null,
                    "Perplexity AI",
                    "AI-powered answer engine providing direct answers to complex queries backed by real-time web citations and structured sources.",
                    "Research",
                    "https://perplexity.ai",
                    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
                    "Freemium",
                    "Real-time Web Search, Academic Citations, Pro Search Reasoning, File Uploads, Focus Modes",
                    LocalDateTime.now().minusDays(15)
                ),
                new Tool(
                    null,
                    "Notion AI",
                    "Integrated workspace assistant that summarizes notes, drafts blog posts, creates task lists, and searches workspace knowledge graphs in seconds.",
                    "Productivity",
                    "https://notion.so/product/ai",
                    "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80",
                    "Freemium",
                    "Document Summarization, Writing Tone Modifier, Database Q&A, Automatic Action Items",
                    LocalDateTime.now().minusDays(12)
                ),
                new Tool(
                    null,
                    "Runway Gen-2",
                    "Multi-modal AI video generation suite allowing creators to generate realistic videos from text, images, or existing video clips.",
                    "Video",
                    "https://runwayml.com",
                    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80",
                    "Freemium",
                    "Text-to-Video, Motion Brush, Frame Interpolation, Camera Control, Background Removal",
                    LocalDateTime.now().minusDays(10)
                ),
                new Tool(
                    null,
                    "Canva Magic Studio",
                    "All-in-one AI visual suite featuring text-to-graphics, instant redesigns, AI background eraser, and automated presentation generation.",
                    "Design",
                    "https://canva.com/magic-studio",
                    "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80",
                    "Freemium",
                    "Magic Design, Text-to-Image, Object Eraser, AI Copywriting, Dynamic Layouts",
                    LocalDateTime.now().minusDays(9)
                ),
                new Tool(
                    null,
                    "Jasper AI",
                    "Enterprise AI copilot built specifically for marketing teams to generate brand-aligned copy, campaign assets, and social posts at scale.",
                    "Marketing",
                    "https://jasper.ai",
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
                    "Paid",
                    "Brand Voice Memory, Campaign Generator, SEO Optimization, 50+ Copywriting Templates",
                    LocalDateTime.now().minusDays(8)
                ),
                new Tool(
                    null,
                    "Khanmigo",
                    "Interactive AI tutor developed by Khan Academy to guide students through math, science, and coding problems without revealing answers directly.",
                    "Education",
                    "https://khanacademy.org/khanmigo",
                    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80",
                    "Free",
                    "Socratic Math Coaching, Essay Feedback, Teacher Lesson Planning, Real-time Hints",
                    LocalDateTime.now().minusDays(6)
                ),
                new Tool(
                    null,
                    "Grammarly GO",
                    "Context-aware writing assistant that helps rewrite sentences for tone, compose replies, summarize emails, and fix grammatical errors instantly.",
                    "Writing",
                    "https://grammarly.com",
                    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
                    "Freemium",
                    "Tone Detector, Sentence Rewriter, Plagiarism Checker, Email Response Generator",
                    LocalDateTime.now().minusDays(5)
                ),
                new Tool(
                    null,
                    "Synthesia",
                    "AI video platform that turns plain text scripts into video presentations featuring photorealistic digital human avatars in over 120 languages.",
                    "Video",
                    "https://synthesia.io",
                    "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80",
                    "Paid",
                    "140+ AI Avatars, 120+ Voice Synthesizers, Custom Avatar Creation, Screen Recording Integration",
                    LocalDateTime.now().minusDays(3)
                )
            );
            toolRepository.saveAll(initialTools);
            System.out.println(">>> Initial AI Tools dataset successfully loaded into MySQL database!");
        }
    }
}
