# Assessment cleanup

Access management contains owner-only deletion for meeyam0103@gmail.com. Select one assessment, inspect company/line of business/reference, and type its complete reference to confirm permanent deletion. Export a copy first if needed.

The server verifies the current owner identity, same-origin request, and exact reference. Database RPC delete_assessment_admin is SECURITY INVOKER, executable by service_role only. Its transaction locks the selected assessment, checks its updated_at timestamp, rejects stored evidence and active notification sends, removes the notification queue row, and deletes the assessment. Existing cascade constraints remove responses, domains, results, recommendations and email delivery logs. Login accounts, organizations and other assessments remain untouched. Sent emails/downloads cannot be recalled.

The additive RPC migration owner_assessment_cleanup was applied to project vwyejoetdnqovzcqyedj. No live assessments were deleted during development. This feature cannot recover deleted records through the UI.
