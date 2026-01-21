CREATE TABLE `activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`petId` int NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `healthRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`petId` int NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`photos` json,
	`aiAnalysis` text,
	`date` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `healthRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invitations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`petId` int NOT NULL,
	`invitedBy` int NOT NULL,
	`inviteeEmail` varchar(320),
	`token` varchar(255) NOT NULL,
	`role` varchar(20) NOT NULL DEFAULT 'member',
	`expiresAt` timestamp NOT NULL,
	`acceptedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `invitations_id` PRIMARY KEY(`id`),
	CONSTRAINT `invitations_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`petId` int,
	`type` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`scheduledFor` timestamp NOT NULL,
	`sentAt` timestamp,
	`isRead` tinyint NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `petShares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`petId` int NOT NULL,
	`userId` int NOT NULL,
	`role` varchar(20) NOT NULL DEFAULT 'member',
	`canEdit` tinyint NOT NULL DEFAULT 1,
	`canDelete` tinyint NOT NULL DEFAULT 0,
	`invitedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `petShares_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(50) NOT NULL,
	`breed` varchar(255),
	`birthDate` varchar(20),
	`weight` varchar(50),
	`microchipId` varchar(255),
	`insurance` text,
	`notes` text,
	`avatar` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pushTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` varchar(512) NOT NULL,
	`platform` varchar(20) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pushTokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `pushTokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_petId_pets_id_fk` FOREIGN KEY (`petId`) REFERENCES `pets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `healthRecords` ADD CONSTRAINT `healthRecords_petId_pets_id_fk` FOREIGN KEY (`petId`) REFERENCES `pets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `healthRecords` ADD CONSTRAINT `healthRecords_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitations` ADD CONSTRAINT `invitations_petId_pets_id_fk` FOREIGN KEY (`petId`) REFERENCES `pets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitations` ADD CONSTRAINT `invitations_invitedBy_users_id_fk` FOREIGN KEY (`invitedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_petId_pets_id_fk` FOREIGN KEY (`petId`) REFERENCES `pets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petShares` ADD CONSTRAINT `petShares_petId_pets_id_fk` FOREIGN KEY (`petId`) REFERENCES `pets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petShares` ADD CONSTRAINT `petShares_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `petShares` ADD CONSTRAINT `petShares_invitedBy_users_id_fk` FOREIGN KEY (`invitedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pets` ADD CONSTRAINT `pets_ownerId_users_id_fk` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pushTokens` ADD CONSTRAINT `pushTokens_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;