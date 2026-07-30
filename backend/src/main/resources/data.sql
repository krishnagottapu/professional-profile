-- Skills seed data (MERGE INTO avoids duplicate inserts on restart)
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (1,  'MCP',               'AI & Architecture', 90, 1);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (2,  'LLM Integration',   'AI & Architecture', 85, 2);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (3,  'Prompt Engineering', 'AI & Architecture', 80, 3);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (4,  'Java',              'Languages',         95, 1);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (5,  'Python',            'Languages',         75, 2);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (6,  'SQL',               'Languages',         85, 3);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (7,  'JavaScript',        'Languages',         80, 4);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (8,  'Spring Boot',       'Frameworks',        95, 1);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (9,  'Hibernate',         'Frameworks',        90, 2);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (10, 'Atlassian SDK',     'Frameworks',        85, 3);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (11, 'Angular',           'Frameworks',        80, 4);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (12, 'Oracle',            'Databases',         80, 1);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (13, 'MySQL',             'Databases',         85, 2);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (14, 'MongoDB',           'Databases',         75, 3);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (15, 'SQL Server',        'Databases',         70, 4);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (16, 'Docker',            'DevOps',            80, 1);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (17, 'Jenkins',           'DevOps',            75, 2);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (18, 'GitLab CI/CD',      'DevOps',            75, 3);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (19, 'Kafka',             'Messaging',         80, 1);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (20, 'JMS',               'Messaging',         70, 2);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (21, 'RabbitMQ',          'Messaging',         70, 3);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (22, 'JUnit',             'Testing',           90, 1);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (23, 'Mockito',           'Testing',           85, 2);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (24, 'Playwright',        'Testing',           80, 3);
MERGE INTO skill (id, name, category, proficiency, sort_order) KEY (id) VALUES
  (25, 'Selenium',          'Testing',           75, 4);


-- Blog posts seed data
MERGE INTO blog_post (id, title, slug, excerpt, content, published, read_time_minutes, created_at, updated_at) KEY (id) VALUES
  (1,
   'How I Built My Portfolio in a Weekend Using AI-Assisted Development',
   'how-i-built-my-portfolio-in-a-weekend-using-ai-assisted-development',
   'A look at how combining Spring Boot, Next.js, and AI coding assistants enabled me to ship a full-stack portfolio site in record time — and what I learned about the future of software engineering.',
   '<p>As a Senior Software Engineer with 8+ years of experience, I''ve seen development workflows evolve dramatically. But nothing has shifted my productivity quite like integrating AI assistants into my daily workflow. This portfolio site you''re reading is a testament to that.</p>

<h2>The Stack</h2>
<p>I chose a stack that plays to my strengths while pushing into modern territory:</p>
<ul>
<li><strong>Backend:</strong> Spring Boot 3.x with Java 21 — my bread and butter from years of enterprise development</li>
<li><strong>Frontend:</strong> Next.js 14+ with TypeScript and Tailwind CSS — server components, app router, the works</li>
<li><strong>Database:</strong> H2 for simplicity, seeded with structured data</li>
<li><strong>Deployment:</strong> Vercel (frontend) + Render (backend) — zero-cost, auto-deploying from GitHub</li>
</ul>

<h2>What AI Changed</h2>
<p>The traditional approach to building a site like this would take 2-3 weeks of evening work. With AI-assisted development, the timeline compressed dramatically. Here''s where it made the biggest difference:</p>
<p><strong>Architecture decisions in minutes, not hours.</strong> Instead of researching patterns and debating with myself, I could describe my constraints and get a well-reasoned recommendation instantly. The dual-theme system, the proxy-based API architecture, the session management approach — all decisions made faster.</p>
<p><strong>Boilerplate elimination.</strong> CRUD controllers, JPA entities, DTOs, validation — the repetitive parts that eat time but don''t require creativity. AI generates these correctly on the first try when given good context.</p>
<p><strong>Cross-stack fluency.</strong> Switching between Java backend patterns and React/TypeScript frontend patterns used to require mental context switching. AI bridges that gap seamlessly.</p>

<h2>What AI Didn''t Change</h2>
<p><strong>Design thinking still requires a human.</strong> The decision to use a Next.js API proxy instead of direct browser-to-backend calls? That came from understanding deployment constraints on free-tier platforms. AI can implement the pattern, but the strategic thinking is still mine.</p>
<p><strong>Debugging complex integration issues.</strong> When session cookies weren''t persisting across the Vercel-to-Render boundary, the fix required understanding how Set-Cookie headers, SameSite attributes, and serverless function execution interact. AI helped, but diagnosing the root cause required experience.</p>
<p><strong>Knowing what to build.</strong> The hardest part of any project isn''t writing code — it''s deciding what matters. Which features to include, which to cut, what the user actually needs. That''s still a human skill.</p>

<h2>Lessons for Fellow Engineers</h2>
<ol>
<li><strong>AI amplifies expertise, it doesn''t replace it.</strong> The more you know, the better you can direct AI. A senior engineer with AI tools isn''t being replaced — they''re becoming a force multiplier.</li>
<li><strong>Prompt engineering is architecture.</strong> Describing what you want clearly and completely is the same skill as writing good requirements. If you''re good at breaking down problems, you''ll be good at working with AI.</li>
<li><strong>Review everything.</strong> AI-generated code passes the "looks right" test easily. The value of experience is knowing which edge cases to check, which security implications to consider, and which patterns will cause maintenance pain later.</li>
<li><strong>Ship faster, iterate more.</strong> The real benefit isn''t writing code faster — it''s shortening the feedback loop. Ship something real, get feedback, improve. AI makes that cycle dramatically shorter.</li>
</ol>

<h2>What''s Next</h2>
<p>I''m continuing to explore how AI tools integrate into enterprise Java development — particularly around Atlassian plugin development, MCP servers, and automated testing. If you''re working in similar spaces, I''d love to connect.</p>
<p><em>This post was written with AI assistance and reviewed for accuracy. Meta, I know.</em></p>',
   true,
   5,
   TIMESTAMP '2026-07-30 10:00:00',
   TIMESTAMP '2026-07-30 10:00:00');
