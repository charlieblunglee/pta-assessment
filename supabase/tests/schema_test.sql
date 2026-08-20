begin;
select plan(18);

select has_table('public', 'organizations');
select has_table('public', 'profiles');
select has_table('public', 'assessments');
select has_table('public', 'assessment_responses');
select has_table('public', 'assessment_domains');
select has_table('public', 'assessment_results');
select has_table('public', 'recommendations');
select has_table('public', 'assessment_evidence_metadata');
select has_table('public', 'email_delivery_log');
select has_table('public', 'industry_configuration');
select has_table('public', 'archetype_configuration');

select col_is_pk('public', 'assessments', 'id');
select col_type_is('public', 'assessments', 'id', 'uuid');
select col_not_null('public', 'assessment_responses', 'score');
select col_not_null('public', 'assessment_results', 'overall_weighted_score');
select policies_are('public', 'assessments', array['assessments_select','assessments_insert','assessments_owner_update','assessments_admin_update']);
select policies_are('public', 'assessment_results', array['results_select']);
select policies_are('public', 'email_delivery_log', array['email_log_select']);

select * from finish();
rollback;
