CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reference` varchar(24) NOT NULL,
	`userId` int NOT NULL,
	`tourId` int NOT NULL,
	`travelDate` bigint NOT NULL,
	`travelers` int NOT NULL,
	`firstName` varchar(120) NOT NULL,
	`lastName` varchar(120) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64) NOT NULL,
	`notes` text,
	`status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookings_reference_unique` UNIQUE(`reference`)
);
--> statement-breakpoint
CREATE TABLE `contactMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(180) NOT NULL,
	`email` varchar(320) NOT NULL,
	`subject` varchar(220) NOT NULL,
	`message` text NOT NULL,
	`status` enum('new','read','replied') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contactMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tours` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`title` varchar(180) NOT NULL,
	`subtitle` varchar(240) NOT NULL,
	`location` varchar(180) NOT NULL,
	`description` text NOT NULL,
	`price` int NOT NULL,
	`duration` int NOT NULL,
	`difficulty` enum('Easy','Moderate','Challenging') NOT NULL DEFAULT 'Moderate',
	`groupSize` int NOT NULL DEFAULT 8,
	`images` json NOT NULL,
	`itinerary` json NOT NULL,
	`highlights` json NOT NULL,
	`included` json NOT NULL,
	`excluded` json NOT NULL,
	`guideName` varchar(120) NOT NULL,
	`guideRole` varchar(160) NOT NULL,
	`guideBio` text NOT NULL,
	`guideImage` text NOT NULL,
	`featured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tours_id` PRIMARY KEY(`id`),
	CONSTRAINT `tours_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_tourId_tours_id_fk` FOREIGN KEY (`tourId`) REFERENCES `tours`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contactMessages` ADD CONSTRAINT `contactMessages_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `bookings_user_idx` ON `bookings` (`userId`);--> statement-breakpoint
CREATE INDEX `bookings_tour_idx` ON `bookings` (`tourId`);--> statement-breakpoint
CREATE INDEX `bookings_status_idx` ON `bookings` (`status`);--> statement-breakpoint
CREATE INDEX `bookings_date_idx` ON `bookings` (`travelDate`);--> statement-breakpoint
CREATE INDEX `contact_user_idx` ON `contactMessages` (`userId`);--> statement-breakpoint
CREATE INDEX `contact_status_idx` ON `contactMessages` (`status`);--> statement-breakpoint
CREATE INDEX `tours_slug_idx` ON `tours` (`slug`);--> statement-breakpoint
CREATE INDEX `tours_featured_idx` ON `tours` (`featured`);