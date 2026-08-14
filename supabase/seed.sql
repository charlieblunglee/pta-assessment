insert into public.industry_configuration (id, key, version, name, definition, status, published_at)
values (
  '10000000-0000-0000-0000-000000000001', 'healthcare', 1, 'Healthcare',
  '{"domainWeights":{"D1":10,"D2":15,"D3":15,"D4":25,"D5":20,"D6":15},"questionCount":42,"scoring":{"yellow":1,"green":2,"blue":3,"normalization":"20 + ((rawScore - 7) / 14) * 80"}}',
  'published', now()
) on conflict (key, version) do nothing;

insert into public.archetype_configuration (industry_configuration_id, archetype, version, title, definition, status, published_at)
values
  ('10000000-0000-0000-0000-000000000001', 'nonclinical', 1, 'Non-Clinical Interaction', '{"code":"A"}', 'published', now()),
  ('10000000-0000-0000-0000-000000000001', 'clinical', 1, 'Clinical Interaction', '{"code":"B","humanDecisionAuthorityRequired":true}', 'published', now()),
  ('10000000-0000-0000-0000-000000000001', 'him', 1, 'HIM Production', '{"code":"C","humanValidationRequired":true}', 'published', now())
on conflict (industry_configuration_id, archetype, version) do nothing;
