#!/usr/bin/env node
/**
 * cloudflare-r2-mcp · MCP server for Cloudflare R2
 * Auto-generated wrapping 0 tools from OpenAPI.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { CloudflareR2 } from '@ai-native-solutions/cloudflare-r2-sdk';

const TOOLS = [];

const server = new Server({ name: 'cloudflare-r2-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

const client = new CloudflareR2({ apiKey: process.env.CLOUDFLARE_R2_API_KEY });

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const method = req.params.name.replace('cloudflare-r2_', '');
  if (typeof client[method] !== 'function') throw new Error('unknown tool: ' + req.params.name);
  const result = await client[method](req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

await server.connect(new StdioServerTransport());
console.error('cloudflare-r2-mcp v1.0.0 · 0 tools ready');
