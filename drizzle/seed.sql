-- Seed: jersey types and their entries (clubs, countries, specials). Idempotent.

INSERT INTO jersey_types (name, slug, sort_order) VALUES ('Club', 'club', 0)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO jersey_groups (type_id, name, slug, sort_order) VALUES
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'Real Madrid', 'real-madrid', 0),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'FC Barcelona', 'fc-barcelona', 1),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'Manchester City', 'manchester-city', 2),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'Manchester United', 'manchester-united', 3),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'Liverpool', 'liverpool', 4),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'Arsenal', 'arsenal', 5),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'Chelsea', 'chelsea', 6),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'Inter Miami', 'inter-miami', 7),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'AC Milan', 'ac-milan', 8),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'Inter Milan', 'inter-milan', 9),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'Juventus', 'juventus', 10),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'FC Bayern Munchen', 'fc-bayern-munchen', 11),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'Paris Saint-Germain', 'paris-saint-germain', 12),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'Borussia Dortmund', 'borussia-dortmund', 13),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'Atletico Madrid', 'atletico-madrid', 14),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'Flamengo', 'flamengo', 15),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'Al-Nassr', 'al-nassr', 16)
ON CONFLICT (type_id, slug) DO NOTHING;

INSERT INTO jersey_types (name, slug, sort_order) VALUES ('Country', 'country', 1)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO jersey_groups (type_id, name, slug, sort_order) VALUES
  ((SELECT id FROM jersey_types WHERE slug = 'country'), 'Argentina', 'argentina', 0),
  ((SELECT id FROM jersey_types WHERE slug = 'country'), 'Brazil', 'brazil', 1),
  ((SELECT id FROM jersey_types WHERE slug = 'country'), 'Germany', 'germany', 2),
  ((SELECT id FROM jersey_types WHERE slug = 'country'), 'France', 'france', 3),
  ((SELECT id FROM jersey_types WHERE slug = 'country'), 'Spain', 'spain', 4),
  ((SELECT id FROM jersey_types WHERE slug = 'country'), 'Portugal', 'portugal', 5),
  ((SELECT id FROM jersey_types WHERE slug = 'country'), 'Saudi Arabia', 'saudi-arabia', 6),
  ((SELECT id FROM jersey_types WHERE slug = 'country'), 'Bangladesh', 'bangladesh', 7),
  ((SELECT id FROM jersey_types WHERE slug = 'country'), 'Netherlands', 'netherlands', 8)
ON CONFLICT (type_id, slug) DO NOTHING;

INSERT INTO jersey_types (name, slug, sort_order) VALUES ('Special', 'special', 2)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO jersey_groups (type_id, name, slug, sort_order) VALUES
  ((SELECT id FROM jersey_types WHERE slug = 'special'), 'Retro', 'retro', 0),
  ((SELECT id FROM jersey_types WHERE slug = 'special'), 'Brazil x Jordan', 'brazil-x-jordan', 1),
  ((SELECT id FROM jersey_types WHERE slug = 'special'), '125 Year Anniversary', '125-year-anniversary', 2),
  ((SELECT id FROM jersey_types WHERE slug = 'special'), 'Authentic Edition', 'authentic-edition', 3)
ON CONFLICT (type_id, slug) DO NOTHING;
