# NTKR Documentation

Simplified documentation for the NTKR (Personal Voice Journal) project.

## 📁 What's Here

- **`PRD.md`** - Product Requirements Document (main specification)
- **`E2EE-ARCHITECTURE.md`** - End-to-End Encryption & Smart Search Architecture (future implementation)

## 🎯 Quick Overview

NTKR is a personal voice journal that:
- Records voice memos through Apple Shortcuts
- Uses Google Gemini AI for transcription and analysis
- Generates daily and weekly summaries automatically
- Tracks mood and provides insights

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Supabase
- **AI**: Google Gemini 2.5 (Flash & Pro)
- **Storage**: Vercel Blob
- **Hosting**: Vercel

## 🚀 Getting Started

See the main [README.md](../README.md) in the project root for setup instructions.

## 🔧 Development Tools

Access development tools at `/api/dev-tools` for:
- Generating mock data
- Clearing test data
- Testing workflows

## 📊 Database Schema

The app uses Supabase with these main tables:
- `voice_notes` - Audio recordings and AI analysis
- `daily_summaries` - Daily mood and activity summaries  
- `weekly_summaries` - Weekly diary entries and quotes

Database operations are handled through MCP Supabase integration.