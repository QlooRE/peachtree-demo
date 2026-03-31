import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { QlooEntity } from "@/lib/qloo";

export async function POST(req: NextRequest) {
  const { artistName, location, brands } = await req.json() as {
    artistName: string;
    location: string;
    brands: QlooEntity[];
  };

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const brandNames = brands.slice(0, 10).map((b) => b.name).join(", ");
  const brandTags = brands
    .slice(0, 5)
    .flatMap((b) => (b.tags ?? []).slice(0, 3).map((t) => t.name))
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(", ");

  const prompt = `You are an experience branding strategist for Peachtree Entertainment, a premier concert promoter.

Artist: ${artistName}
Market: ${location}

Based on Qloo cultural intelligence, fans of ${artistName} in ${location} have strong affinity for these brands:
${brandNames}

Cultural/lifestyle tags: ${brandTags}

Generate exactly 3 distinct, named experience branding concepts for a ${artistName} show or festival in ${location}. Each concept:
- Has a short evocative name (3-5 words)
- Describes the experience theme in 2 sentences
- Identifies the target demographic and lifestyle identity
- Names 2-3 specific sponsor brands from the list that fit naturally
- Is grounded in the actual cultural signals (not generic)

Format each concept as:
**[Concept Name]**
[Experience description]
Target: [demographic + lifestyle identity]
Sponsors: [brand names]

No preamble.`;

  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 900,
      messages: [{ role: "user", content: prompt }],
    });
    const text = (msg.content[0] as { text: string }).text;
    return NextResponse.json({ concepts: text });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
