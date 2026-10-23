'use server'

import { db } from '@/lib/db'
import { controlNumberSequences, employees, leaveApplications } from '@/lib/db/schema'
import { desc, eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function getApplications() {
  return db.select().from(leaveApplications).orderBy(desc(leaveApplications.createdAt)).limit(20)
}

export async function createDemoApplication() {
  const year = new Date().getFullYear()
  const sequence = await db.insert(controlNumberSequences).values({ year, lastNumber: 1 }).onConflictDoUpdate({
    target: controlNumberSequences.year,
    set: { lastNumber: sql`${controlNumberSequences.lastNumber} + 1` },
  }).returning({ lastNumber: controlNumberSequences.lastNumber })
  const number = sequence[0]?.lastNumber ?? 1
  const applicationId = `LA-${year}-${String(number).padStart(4, '0')}`
  const controlNumber = `SDO-BEN-${year}-${String(number).padStart(4, '0')}`
  const demoEmployeeId = '00000000-0000-0000-0000-000000000000'
  await db.insert(employees).values({ id: demoEmployeeId, employeeId: 'DEMO-0001', firstName: 'Demo', lastName: 'Employee', position: 'Administrative Staff', office: 'SDO Benguet' }).onConflictDoNothing()
  await db.insert(leaveApplications).values({
    applicationId,
    controlNumber,
    employeeId: '00000000-0000-0000-0000-000000000000',
    leaveType: 'Vacation Leave',
    dateFrom: new Date().toISOString().slice(0, 10),
    dateTo: new Date().toISOString().slice(0, 10),
    days: '1',
    reason: 'Demo application',
    status: 'SUBMITTED',
    submittedAt: new Date(),
  }).onConflictDoNothing()
  revalidatePath('/')
  return { applicationId, controlNumber }
}
