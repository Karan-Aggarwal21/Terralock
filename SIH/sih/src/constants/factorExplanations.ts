export interface FactorDetail {
  plainExplanation: string;
  mitigationStrategy: string;
  category: string;
}

export const FACTOR_KNOWLEDGE_BASE: Record<string, FactorDetail> = {
  'Legal Dispute': {
    plainExplanation: 'Court cases or stay orders filed by landowners contesting circle rate valuation or acquisition notifications under Section 64 of the Act.',
    mitigationStrategy: 'Prioritize fast-track arbitration camps and direct judicial settlement filings to prevent protracted adjournments.',
    category: 'Judicial / Legal',
  },
  'Documentation Issues': {
    plainExplanation: 'Missing ancestral title records, unresolved succession genealogies, or discrepancies between physical ground measurements and revenue maps.',
    mitigationStrategy: 'Deploy mobile revenue demarcation teams for spot verification with village elders and panchayat heads.',
    category: 'Revenue Documentation',
  },
  'Documentation Incompleteness': {
    plainExplanation: 'Missing ancestral title records, unresolved succession genealogies, or discrepancies between physical ground measurements and revenue maps.',
    mitigationStrategy: 'Deploy mobile revenue demarcation teams for spot verification with village elders and panchayat heads.',
    category: 'Revenue Documentation',
  },
  'Compensation Delay': {
    plainExplanation: 'Disagreements over circle rate benchmarks, delayed fund allocations, or escrow disbursement verification bottlenecks.',
    mitigationStrategy: 'Expedite Direct Benefit Transfer (DBT) tranches and set up localized compensation dispute desks.',
    category: 'Financial / Treasury',
  },
  'Administrative Approval': {
    plainExplanation: 'Pending multi-department statutory notifications, environmental clearances, or inter-ministerial gazette declarations.',
    mitigationStrategy: 'Escalate to Chief Secretary state infrastructure monitoring group for single-window expedited sign-off.',
    category: 'Inter-Departmental Governance',
  },
  'Ownership Complexity': {
    plainExplanation: 'Land held by multiple undivided family heirs without registered partition deeds or joint tenancy consensus.',
    mitigationStrategy: 'Execute joint indemnity bonds or court escrow deposits allowing immediate work commencement.',
    category: 'Land Title',
  },
  'Utility Relocation': {
    plainExplanation: 'High-voltage transmission lines, water pipelines, or fiber optic cables intersecting the planned right-of-way corridor.',
    mitigationStrategy: 'Issue advance shifting sanctions and schedule joint shutdown windows with state electricity utility.',
    category: 'Utility Infrastructure',
  },
  'Survey Discrepancy': {
    plainExplanation: 'Differences between modern satellite cadastral boundaries and legacy village revenue survey sheets.',
    mitigationStrategy: 'Utilize DGPS (Differential GPS) drone surveys for millimeter-accurate joint boundary demarcation.',
    category: 'Cadastral Survey',
  },
  'Environmental Clearances': {
    plainExplanation: 'Forest diversion permissions, Coastal Regulation Zone (CRZ) clearances, or eco-sensitive zone statutory appraisals.',
    mitigationStrategy: 'Submit compensatory afforestation proposals and initiate parallel stage-1 and stage-2 clearances.',
    category: 'Environmental / Forestry',
  },
  'Judicial Injunction / Stay': {
    plainExplanation: 'Active High Court stay order prohibiting physical possession or land entry along designated revenue survey numbers.',
    mitigationStrategy: 'File urgent civil vacate-stay applications detailing national public interest and essential infrastructure status.',
    category: 'Judicial / Legal',
  },
  'Disputed Title Claims': {
    plainExplanation: 'Conflicting historical leaseholders, customary tenancy claims, or disputed public waqf/temple trust tenures.',
    mitigationStrategy: 'Deposit disputed compensation in District Court under Section 77 while securing physical possession.',
    category: 'Land Title',
  },
  'Inter-Agency Approvals': {
    plainExplanation: 'Coordinating simultaneous land transfers across railways, defense estates, and municipal authorities.',
    mitigationStrategy: 'Convene monthly inter-agency task force meetings with designated nodal liaison officers.',
    category: 'Inter-Departmental Governance',
  },
  'Resettlement Demands': {
    plainExplanation: 'Rehabilitation and resettlement (R&R) package negotiations regarding replacement housing colonies and livelihood grants.',
    mitigationStrategy: 'Finalize model R&R layout plans with community representatives and guarantee skill development stipends.',
    category: 'Social Impact',
  },
  'Other': {
    plainExplanation: 'Miscellaneous residual operational risks such as seasonal monsoon access constraints and local civil logistics.',
    mitigationStrategy: 'Maintain flexible construction work windows and local stakeholder grievance hotlines.',
    category: 'Operational / Environmental',
  },
};

export const getFactorDetail = (name: string): FactorDetail => {
  return (
    FACTOR_KNOWLEDGE_BASE[name] || {
      plainExplanation: 'Secondary procedural factor identified during automated statistical risk pattern matching.',
      mitigationStrategy: 'Review parcel revenue files and conduct joint field verification with local district administration.',
      category: 'General Acquisition Factor',
    }
  );
};
