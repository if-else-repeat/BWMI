import Dexie from 'dexie';

export class BharatResilienceDB extends Dexie {
  constructor() {
    super('BharatResilienceDB');
    this.version(2).stores({
      drafts: 'id, serviceType, lastSavedAt, step, userUan',
      syncQueue: '++id, serviceType, referenceId, queuedAt, status, attempts, userUan',
      submissions: '++id, referenceId, serviceType, submittedAt, ackNumber, isSynced, userUan',
      auditLogs: '++id, timestamp, eventType, networkState',
      cachedProfiles: 'uan, name, epfNumber',
      userPasskeys: 'uan, credentialId, registeredAt'
    });
  }
}

export const db = new BharatResilienceDB();

// Two Synthetic Users: Ramesh Kumar (Complete History) and Priya Sharma (New Member)
export const SYNTHETIC_USERS = {
  '101294829101': {
    uan: '101294829101',
    formattedUan: '1012 9482 9101',
    name: 'Ramesh Kumar',
    fatherName: 'Late Suresh Kumar',
    dob: '14-08-1988',
    gender: 'MALE',
    email: 'ramesh.kumar88@gov-citizen.in',
    phoneMasked: '+91 98765-XXXX1',
    aadhaarMasked: 'XXXX-XXXX-8921',
    panMasked: 'ABCDE1234F',
    epfNumber: 'MH/BAN/0012345/000/0001',
    establishmentName: 'Bharat Infrastructure & Logistics Ltd.',
    joiningDate: '12-04-2017',
    serviceYears: '7 Years 4 Months',
    totalPfBalance: 148200.00,
    employeeShare: 102400.00,
    employerShare: 33800.00,
    pensionShare: 12000.00,
    nomineeName: 'Sunita Kumar (Spouse - 100%)',
    eNominationStatus: 'COMPLETED',
    bankAccount: {
      accountNumber: '91823746192837',
      bankName: 'State Bank of India',
      branch: 'Koramangala, Bengaluru',
      ifsc: 'SBIN0001234',
      status: 'VERIFIED'
    },
    passbookEntries: [
      { month: 'JUL 2026', wage: '₹35,000', empShare: '+ ₹3,750', emplyrShare: '+ ₹1,250', pension: '+ ₹2,500' },
      { month: 'JUN 2026', wage: '₹35,000', empShare: '+ ₹3,750', emplyrShare: '+ ₹1,250', pension: '+ ₹2,500' },
      { month: 'MAY 2026', wage: '₹35,000', empShare: '+ ₹3,750', emplyrShare: '+ ₹1,250', pension: '+ ₹2,500' },
      { month: 'APR 2026', wage: '₹35,000', empShare: '+ ₹3,750', emplyrShare: '+ ₹1,250', pension: '+ ₹2,500' },
      { month: 'INTEREST CREDIT (FY 25-26 @ 8.25%)', wage: '-', empShare: '+ ₹7,840', emplyrShare: '+ ₹3,400', pension: '-' }
    ],
    claimsHistory: [
      {
        id: 'EPFO-2024-CLM-49120',
        type: 'Form 31 (Medical Para 68J)',
        date: '14-11-2024',
        amount: '35000',
        status: 'SETTLED',
        trackingStep: 4,
        disbursedTo: 'State Bank of India (•••• 8237)'
      }
    ]
  },
  '101940281192': {
    uan: '101940281192',
    formattedUan: '1019 4028 1192',
    name: 'Priya Sharma',
    fatherName: 'Rajesh Sharma',
    dob: '02-11-1999',
    gender: 'FEMALE',
    email: 'priya.sharma99@gov-citizen.in',
    phoneMasked: '+91 94120-XXXX9',
    aadhaarMasked: 'XXXX-XXXX-4019',
    panMasked: 'PQRST9876Z',
    epfNumber: 'DL/CPM/0098412/000/0002',
    establishmentName: 'TechNova Digital Services Pvt Ltd',
    joiningDate: '01-02-2026',
    serviceYears: '6 Months',
    totalPfBalance: 18500.00,
    employeeShare: 12500.00,
    employerShare: 4200.00,
    pensionShare: 1800.00,
    nomineeName: 'Not Registered',
    eNominationStatus: 'PENDING',
    bankAccount: {
      accountNumber: '50100481928410',
      bankName: 'HDFC Bank',
      branch: 'Connaught Place, New Delhi',
      ifsc: 'HDFC0000240',
      status: 'VERIFIED'
    },
    passbookEntries: [
      { month: 'JUL 2026', wage: '₹28,000', empShare: '+ ₹2,500', emplyrShare: '+ ₹840', pension: '+ ₹1,660' },
      { month: 'JUN 2026', wage: '₹28,000', empShare: '+ ₹2,500', emplyrShare: '+ ₹840', pension: '+ ₹1,660' },
      { month: 'MAY 2026', wage: '₹28,000', empShare: '+ ₹2,500', emplyrShare: '+ ₹840', pension: '+ ₹1,660' }
    ],
    claimsHistory: []
  }
};

export const DEFAULT_USER_UAN = '101294829101';
export const SYNTHETIC_CITIZEN = SYNTHETIC_USERS[DEFAULT_USER_UAN];

// Seed profiles to Dexie on boot
export async function initializeSyntheticDatabase() {
  const count = await db.cachedProfiles.count();
  if (count === 0) {
    await db.cachedProfiles.bulkPut(Object.values(SYNTHETIC_USERS));
  }
}

// Autosave draft to IndexedDB at every keystroke (0ms latency, zero server roundtrip)
export async function saveDraft(serviceType, formData, step = 1, userUan = DEFAULT_USER_UAN) {
  try {
    const draftPayload = {
      id: `${serviceType}_${userUan}`,
      serviceType,
      formData,
      step,
      userUan,
      lastSavedAt: new Date().toISOString(),
      timestampMs: Date.now()
    };
    await db.drafts.put(draftPayload);
    return draftPayload;
  } catch (err) {
    console.error('Dexie saveDraft failed:', err);
    throw err;
  }
}

export async function getDraft(serviceType, userUan = DEFAULT_USER_UAN) {
  try {
    return await db.drafts.get(`${serviceType}_${userUan}`);
  } catch (err) {
    console.error('Dexie getDraft failed:', err);
    return null;
  }
}

export async function clearDraft(serviceType, userUan = DEFAULT_USER_UAN) {
  try {
    await db.drafts.delete(`${serviceType}_${userUan}`);
  } catch (err) {
    console.error('Dexie clearDraft failed:', err);
  }
}

// Enqueue offline submission into Dexie syncQueue
export async function enqueueOfflinePayload(serviceType, payload, userUan = DEFAULT_USER_UAN) {
  try {
    const referenceId = `EPF-OFFLINE-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const queueItem = {
      serviceType,
      referenceId,
      userUan,
      payload,
      queuedAt: new Date().toISOString(),
      timestampMs: Date.now(),
      status: 'QUEUED_OFFLINE',
      attempts: 0,
      errorReason: '504_GATEWAY_SIMULATED_OFFLINE'
    };

    const id = await db.syncQueue.add(queueItem);
    await logAuditEvent('CLAIM_QUEUED_OFFLINE', { referenceId, serviceType, id, userUan }, 'OFFLINE');
    return { id, referenceId, queueItem };
  } catch (err) {
    console.error('Dexie enqueueOfflinePayload failed:', err);
    throw err;
  }
}

// Process pending syncQueue items when network returns
export async function processSyncQueue(onItemSynced = null) {
  try {
    const queuedItems = await db.syncQueue.where('status').equals('QUEUED_OFFLINE').toArray();
    if (queuedItems.length === 0) return [];

    const syncedResults = [];

    for (const item of queuedItems) {
      const ackNumber = `EPFO-2026-PF-${Math.floor(100000 + Math.random() * 900000)}`;
      const receiptHash = `SHA256-${Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;

      const submissionRecord = {
        referenceId: item.referenceId,
        serviceType: item.serviceType,
        userUan: item.userUan || DEFAULT_USER_UAN,
        payload: item.payload,
        submittedAt: new Date().toISOString(),
        ackNumber,
        receiptHash,
        isSynced: true,
        originallyQueuedAt: item.queuedAt
      };

      await db.submissions.add(submissionRecord);

      await db.syncQueue.update(item.id, {
        status: 'SYNC_COMPLETED',
        syncedAt: new Date().toISOString(),
        ackNumber
      });

      await clearDraft(item.serviceType, item.userUan);
      await logAuditEvent('BACKGROUND_SYNC_SUCCESS', { referenceId: item.referenceId, ackNumber }, 'ONLINE_RECONNECTED');

      if (onItemSynced) {
        onItemSynced(submissionRecord);
      }
      syncedResults.push(submissionRecord);
    }

    return syncedResults;
  } catch (err) {
    console.error('Dexie processSyncQueue failed:', err);
    throw err;
  }
}

export async function logAuditEvent(eventType, details = {}, networkState = 'UNKNOWN') {
  try {
    await db.auditLogs.add({
      timestamp: new Date().toISOString(),
      timestampMs: Date.now(),
      eventType,
      details,
      networkState
    });
  } catch (err) {
    console.warn('Audit log write failed:', err);
  }
}
