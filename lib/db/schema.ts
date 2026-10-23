import { date, decimal, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name').notNull(),
  roleId: uuid('role_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const employees = pgTable('employees', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: text('employee_id').notNull().unique(),
  userId: uuid('user_id'),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  middleName: text('middle_name'),
  position: text('position').notNull(),
  office: text('office').notNull(),
  email: text('email'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const leaveCredits = pgTable('leave_credits', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: uuid('employee_id').notNull().unique(),
  vacation: decimal('vacation', { precision: 8, scale: 2 }).notNull().default('0'),
  sick: decimal('sick', { precision: 8, scale: 2 }).notNull().default('0'),
  special: decimal('special', { precision: 8, scale: 2 }).notNull().default('0'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const leaveApplications = pgTable('leave_applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  applicationId: text('application_id').notNull().unique(),
  controlNumber: text('control_number').unique(),
  employeeId: uuid('employee_id').notNull(),
  leaveType: text('leave_type').notNull(),
  dateFrom: date('date_from').notNull(),
  dateTo: date('date_to').notNull(),
  days: decimal('days', { precision: 6, scale: 2 }).notNull(),
  reason: text('reason'),
  status: text('status').notNull().default('DRAFT'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const controlNumberSequences = pgTable('control_number_sequences', {
  year: integer('year').primaryKey(),
  lastNumber: integer('last_number').notNull().default(0),
})
