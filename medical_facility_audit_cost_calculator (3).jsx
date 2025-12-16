import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function AuditCostCalculator() {
  const exportToPDF = async () => {
    const element = document.getElementById("audit-calculator-root");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("medical-audit-cost-analysis.pdf");
  };
  const [inputs, setInputs] = useState({
    avgHourlyRate: 45,
    complianceViolationCost: 2500,
    preAuditRemediationHours: 120,
    denialRate: 6,
    avgClaimValue: 350,
    monthlyClaims: 1200,
    turnoverCostPerEmployee: 8000,
    complianceTurnoverPercent: 4,
    employeeCount: 85,
    censusSize: 120,
    auditHours: 60,
    postAuditRemediationHours: 90,
    consultantHourlyRate: 175,
    consultantHours: 20,
    violationCount: 3,
    riskMultiplier: 1.1,
    accreditationLossProbability: 5,
    avgMonthlyReferralRevenue: 150000,
    referralReductionPercent: 30,
    monthsImpacted: 6,
    reputationRecoveryCost: 50000
  });

  const handleChange = (key, value) => {
    setInputs({ ...inputs, [key]: Number(value) });
  };

  const costs = useMemo(() => {
    const laborCost = (inputs.preAuditRemediationHours + inputs.auditHours + inputs.postAuditRemediationHours) * inputs.avgHourlyRate;

    const consultantCost = inputs.consultantHourlyRate * inputs.consultantHours;

    const violationCost = inputs.violationCount * inputs.complianceViolationCost;

    const denialCost =
      (inputs.denialRate / 100) *
      inputs.monthlyClaims *
      inputs.avgClaimValue;

    const turnoverCost =
      (inputs.complianceTurnoverPercent / 100) *
      inputs.employeeCount *
      inputs.turnoverCostPerEmployee;

    const referralLossCost =
      (inputs.accreditationLossProbability / 100) *
      (inputs.avgMonthlyReferralRevenue * (inputs.referralReductionPercent / 100)) *
      inputs.monthsImpacted;

    const baseTotal =
      laborCost +
      consultantCost +
      violationCost +
      denialCost +
      turnoverCost +
      referralLossCost;

    const adjustedTotal =
      (baseTotal + inputs.reputationRecoveryCost) * inputs.riskMultiplier;

    return {
      laborCost,
      consultantCost,
      violationCost,
      denialCost,
      turnoverCost,
      referralLossCost,
      baseTotal,
      adjustedTotal
    };
  }, [inputs]);

  const renderInput = (label, key) => (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input
        type="number"
        value={inputs[key]}
        onChange={(e) => handleChange(key, e.target.value)}
      />
    </div>
  );

  return (
    <div id="audit-calculator-root" className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Medical Facility Audit Cost Calculator</h1>
        <button
          onClick={exportToPDF}
          className="px-4 py-2 rounded-xl bg-black text-white text-sm shadow"
        >
          Export to PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow">
          <CardContent className="p-4 space-y-4">
            <h2 className="font-medium text-lg">Facility & Staffing</h2>
            {renderInput("Employee Count", "employeeCount")}
            {renderInput("Average Hourly Rate ($)", "avgHourlyRate")}
            {renderInput("Census Size", "censusSize")}
            {renderInput("Turnover Cost per Employee ($)", "turnoverCostPerEmployee")}
            {renderInput("Compliance-Driven Turnover (%)", "complianceTurnoverPercent")}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardContent className="p-4 space-y-4">
            <h2 className="font-medium text-lg">Audit Effort</h2>
            {renderInput("Pre-Audit Remediation Hours", "preAuditRemediationHours")}
            {renderInput("Estimated Audit Hours", "auditHours")}
            {renderInput("Post-Audit Remediation Hours", "postAuditRemediationHours")}
            {renderInput("Consultant Hourly Rate ($)", "consultantHourlyRate")}
            {renderInput("Consultant Hours", "consultantHours")}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardContent className="p-4 space-y-4">
            <h2 className="font-medium text-lg">Compliance & Claims Impact</h2>
            {renderInput("Compliance Violations Found", "violationCount")}
            {renderInput("Avg Cost per Violation ($)", "complianceViolationCost")}
            {renderInput("Documentation-Related Denial Rate (%)", "denialRate")}
            {renderInput("Monthly Claims Volume", "monthlyClaims")}
            {renderInput("Average Claim Value ($)", "avgClaimValue")}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow">
          <CardContent className="p-4 space-y-4">
            <h2 className="font-medium text-lg">Risk Adjustment</h2>
            {renderInput("Risk Multiplier (legal, payer scrutiny)", "riskMultiplier")}
            <p className="text-sm text-muted-foreground">
              Adjusts total cost to account for payer behavior, repeat audits, and legal exposure.
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card className="rounded-2xl shadow">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-medium">Cost Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>Labor Cost</div><div className="text-right">${costs.laborCost.toLocaleString()}</div>
            <div>Consultant Cost</div><div className="text-right">${costs.consultantCost.toLocaleString()}</div>
            <div>Compliance Violations</div><div className="text-right">${costs.violationCost.toLocaleString()}</div>
            <div>Claim Denials (Monthly Impact)</div><div className="text-right">${costs.denialCost.toLocaleString()}</div>
            <div>Staff Turnover</div><div className="text-right">${costs.turnoverCost.toLocaleString()}</div>
            <div>Lost Referrals (Accreditation Risk)</div><div className="text-right">${costs.referralLossCost.toLocaleString()}</div>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total Estimated Audit Cost</span>
            <span>${costs.adjustedTotal.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

