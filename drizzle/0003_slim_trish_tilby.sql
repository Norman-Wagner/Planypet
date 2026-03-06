CREATE TABLE `chipRegHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`chipRegId` int NOT NULL,
	`database` varchar(50) NOT NULL,
	`status` varchar(50) NOT NULL,
	`details` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chipRegHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `chipRegistrationHistory`;--> statement-breakpoint
ALTER TABLE `chipRegHistory` ADD CONSTRAINT `chipRegHistory_chipRegId_chipRegistrations_id_fk` FOREIGN KEY (`chipRegId`) REFERENCES `chipRegistrations`(`id`) ON DELETE cascade ON UPDATE no action;