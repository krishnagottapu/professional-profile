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
