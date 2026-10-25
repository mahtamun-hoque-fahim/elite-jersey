-- Seed: jersey types and their entries (clubs, countries, specials, combos). Idempotent.

INSERT INTO jersey_types (name, slug, sort_order) VALUES ('Club', 'club', 0)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO jersey_groups (type_id, name, slug, sort_order) VALUES
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'AC Milan', 'ac-milan', 0),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'Arsenal', 'arsenal', 1),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'FC Barcelona', 'fc-barcelona', 2),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'Manchester United', 'manchester-united', 3),
  ((SELECT id FROM jersey_types WHERE slug = 'club'), 'Real Madrid', 'real-madrid', 4)
ON CONFLICT (type_id, slug) DO NOTHING;

INSERT INTO jersey_types (name, slug, sort_order) VALUES ('Country', 'country', 1)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO jersey_groups (type_id, name, slug, sort_order) VALUES
  ((SELECT id FROM jersey_types WHERE slug = 'country'), 'Argentina', 'argentina', 0),
  ((SELECT id FROM jersey_types WHERE slug = 'country'), 'Bangladesh', 'bangladesh', 1)
ON CONFLICT (type_id, slug) DO NOTHING;

INSERT INTO jersey_types (name, slug, sort_order) VALUES ('Special', 'special', 2)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO jersey_groups (type_id, name, slug, sort_order) VALUES
  ((SELECT id FROM jersey_types WHERE slug = 'special'), 'Spider-Man Collab', 'spider-man-collab', 0)
ON CONFLICT (type_id, slug) DO NOTHING;

INSERT INTO jersey_types (name, slug, sort_order) VALUES ('Combo', 'combo', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO jersey_groups (type_id, name, slug, sort_order) VALUES
  ((SELECT id FROM jersey_types WHERE slug = 'combo'), 'Combo Packs', 'combo-packs', 0)
ON CONFLICT (type_id, slug) DO NOTHING;
