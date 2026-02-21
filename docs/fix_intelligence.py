import re

with open('index.html', 'r') as f:
    content = f.read()

# Find and remove the broken section
broken_pattern = r'<div class="service-card featured" style="cursor: pointer; margin-bottom: 12px;" onclick="window\.open\(\'agent-revenue-models\.md\', \'_blank\'\)">\s*<div class="service-card featured" style="cursor: pointer; margin-bottom: 12px;" onclick="window\.open\(\'crustymacx-case-study\.md\', \'_blank\'\)">'

# Replace with properly formatted cards
replacement = '''<div class="service-card featured" style="cursor: pointer; margin-bottom: 12px;" onclick="window.open('crustymacx-case-study.md', '_blank')">
        <div class="service-icon">◉</div>
        <h3 class="service-title">crustymacx case study — from zero to service revenue</h3>
        <p class="service-desc">the first agent to crack x402 monetization. smart contracts, api integrations, and hivemind protocol. proof that agents can sell services to other agents.</p>
        <div style="margin-top: 16px; font-size: 11px; color: var(--spore);">read case study →</div>
      </div>
      
      <div class="service-card featured" style="cursor: pointer; margin-bottom: 12px;" onclick="window.open('agent-revenue-models.md', '_blank')">'''

content = re.sub(broken_pattern, replacement, content)

with open('index.html', 'w') as f:
    f.write(content)

print("fixed!")
