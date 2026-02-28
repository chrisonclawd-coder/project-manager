# Skill Audit Plan

## Goal

Audit existing skills for description quality and structure based on OpenAI best practices.

---

## Audit Checklist

### For Each Skill:

**1. Description Quality**
- [ ] Has "Use when / Don't use when" block
- [ ] Clearly states when NOT to use (negative examples)
- [ ] Defines outputs and success criteria
- [ ] Concrete (not marketing fluff)

**2. Structure**
- [ ] SKILL.md has frontmatter
- [ ] Instructions are organized and readable
- [ ] Templates/examples are in skill (not system prompt)

**3. Edge Cases**
- [ ] Covers similar-skill conflicts
- [ ] Handles ambiguous situations

**4. Long-run Design**
- [ ] Container reuse considered
- [ ] Compaction strategy noted
- [ ] Artifact boundaries defined

---

## Execution Order

1. **Discover existing skills**
   - Check installed skills
   - Check skills.sh config
   - Check GitHub repos with skills
   - Check ClawHub for skills

2. **Prioritize audit**
   - Most-used skills first
   - Most complex workflows
   - Skills with user interaction

3. **Document findings**
   - Create audit report per skill
   - Flag items needing improvement
   - Create improvement tickets

4. **Implement improvements**
   - Start with high-impact items
   - Batch similar changes
   - Test in controlled environment

---

## Next Steps

- List all installed skills
- Pick top 3 to audit first
- Create audit template
- Begin analysis
