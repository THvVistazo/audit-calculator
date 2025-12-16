# Medical Facility Audit Cost Calculator
# Simple Streamlit application

import streamlit as st

st.set_page_config(page_title="Audit Cost Calculator", layout="centered")

st.title("Medical Facility Audit Cost Calculator")
st.caption("Estimate the true operational, financial, and reputational cost of a medical audit")

st.header("Facility & Staffing")
employee_count = st.number_input("Employee Count", min_value=0, value=85)
avg_hourly_rate = st.number_input("Average Hourly Rate ($)", min_value=0.0, value=45.0)
census_size = st.number_input("Average Census Size", min_value=0, value=120)
turnover_cost = st.number_input("Turnover Cost per Employee ($)", min_value=0.0, value=8000.0)
compliance_turnover_pct = st.number_input("Compliance-Driven Turnover (%)", min_value=0.0, value=4.0)

st.header("Audit Effort")
pre_audit_hours = st.number_input("Pre-Audit Remediation Hours", min_value=0.0, value=120.0)
audit_hours = st.number_input("Audit Hours", min_value=0.0, value=60.0)
post_audit_hours = st.number_input("Post-Audit Remediation Hours", min_value=0.0, value=90.0)
consultant_rate = st.number_input("Consultant Hourly Rate ($)", min_value=0.0, value=175.0)
consultant_hours = st.number_input("Consultant Hours", min_value=0.0, value=20.0)

st.header("Compliance & Claims Impact")
violation_count = st.number_input("Compliance Violations Found", min_value=0, value=3)
violation_cost = st.number_input("Average Cost per Violation ($)", min_value=0.0, value=2500.0)
denial_rate = st.number_input("Documentation-Related Denial Rate (%)", min_value=0.0, value=6.0)
monthly_claims = st.number_input("Monthly Claims Volume", min_value=0, value=1200)
avg_claim_value = st.number_input("Average Claim Value ($)", min_value=0.0, value=350.0)

st.header("Reputation & Referral Impact")
monthly_referrals = st.number_input("Average Monthly Referrals", min_value=0, value=100)
referral_loss_pct = st.number_input("Referral Loss Due to Accreditation Risk (%)", min_value=0.0, value=15.0)
avg_revenue_per_client = st.number_input("Average Revenue per Client ($)", min_value=0.0, value=2500.0)
marketing_recovery_cost = st.number_input("Reputation Recovery / Marketing Cost ($)", min_value=0.0, value=15000.0)

st.header("Risk Adjustment")nrisk_multiplier = st.number_input("Risk Multiplier (legal, payer scrutiny)", min_value=1.0, value=1.1)

# --- Calculations ---
labor_cost = (pre_audit_hours + audit_hours + post_audit_hours) * avg_hourly_rate
consultant_cost = consultant_rate * consultant_hours
violation_total = violation_count * violation_cost

denial_cost = (denial_rate / 100) * monthly_claims * avg_claim_value

turnover_total = (compliance_turnover_pct / 100) * employee_count * turnover_cost

referral_loss = (referral_loss_pct / 100) * monthly_referrals * avg_revenue_per_client

base_total = (
    labor_cost
    + consultant_cost
    + violation_total
    + denial_cost
    + turnover_total
    + referral_loss
    + marketing_recovery_cost
)

adjusted_total = base_total * risk_multiplier

st.divider()
st.subheader("Cost Breakdown")

st.write(f"Labor Cost: **${labor_cost:,.2f}**")
st.write(f"Consultant Cost: **${consultant_cost:,.2f}**")
st.write(f"Compliance Violations: **${violation_total:,.2f}**")
st.write(f"Claim Denials (Monthly): **${denial_cost:,.2f}**")
st.write(f"Staff Turnover Cost: **${turnover_total:,.2f}**")
st.write(f"Lost Referrals Revenue: **${referral_loss:,.2f}**")
st.write(f"Reputation / Marketing Recovery: **${marketing_recovery_cost:,.2f}**")

st.divider()
st.metric("Total Estimated Audit Cost", f"${adjusted_total:,.2f}")

st.caption("This model is directional and intended for executive-level cost justification. Actual results may vary.")
