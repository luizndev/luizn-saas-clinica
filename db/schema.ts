import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, time, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  usersToClinics: many(usersToClinicsTable),
}));

export const usersToClinicsTable = pgTable("users_to_clinics", {
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const usersToClinicsTableRelations = relations(usersToClinicsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [usersToClinicsTable.userId],
    references: [usersTable.id],
  }),
  clinic: one(clinicsTable, {
    fields: [usersToClinicsTable.clinicId],
    references: [clinicsTable.id],
  }),
}));

export const clinicsTable = pgTable("clinics", {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const clinicTableRelations = relations(clinicsTable, ({ many }) => ({
  doctors: many(doctorsTable),
  pacients: many(pacientTable),
  appointments: many(appointmentsTable),
  usersToClinics: many(usersToClinicsTable),
}));



export const doctorsTable = pgTable("doctors", {
  id: uuid('id').defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  specialty: text("specialty").notNull(),
  // 1 - Monday, 2 - Tuesday, 3 - Wednesday, 4 - Thursday, 5 - Friday, 6 - Saturday, 0 - Sunday
  availableFromWeekDay: integer("available_from_week_day").notNull(),
  availableToWeekDay: integer("available_to_week_day").notNull(),
  availableFromTime: time("available_from_time").notNull(),
  availableToTime: time("available_to_time").notNull(),
  appointmentPriceInCents: integer("appointment_price_in_cents").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const pacientSexEnum = pgEnum("pacient_sex", ["male", "female", "other"]);

export const pacientTable = pgTable("pacients", {
  id: uuid('id').defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  sex: pacientSexEnum("sex").notNull(),   
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const appointmentsTable = pgTable("appointments", {
  id: uuid('id').defaultRandom().primaryKey(),
  clinicId: uuid("clinic_id").notNull().references(() => clinicsTable.id, { onDelete: "cascade" }),
  doctorId: uuid("doctor_id").notNull().references(() => doctorsTable.id, { onDelete: "cascade" }),
  pacientId: uuid("pacient_id").notNull().references(() => pacientTable.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});


export const doctorTableRelations = relations(doctorsTable, ({ one, many }) => ({
  clinic: one(clinicsTable, {
    fields: [doctorsTable.clinicId],
    references: [clinicsTable.id],
  }),
  appointments: many(appointmentsTable),
}));

export const pacientTableRelations = relations(pacientTable, ({ one, many }) => ({
  clinic: one(clinicsTable, {
    fields: [pacientTable.clinicId],
    references: [clinicsTable.id],
  }),
  appointments: many(appointmentsTable),
}));

export const appointmentTableRelations = relations(appointmentsTable, ({ one }) => ({
  clinic: one(clinicsTable, {
    fields: [appointmentsTable.clinicId],
    references: [clinicsTable.id],
  }),
  doctor: one(doctorsTable, {
    fields: [appointmentsTable.doctorId],
    references: [doctorsTable.id],
  }),
  pacient: one(pacientTable, {
    fields: [appointmentsTable.pacientId],
    references: [pacientTable.id],
  }),
}));