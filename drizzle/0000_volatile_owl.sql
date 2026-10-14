CREATE TABLE `estatisticas` (
	`id` text PRIMARY KEY NOT NULL,
	`idJogador` text NOT NULL,
	`idPartida` text NOT NULL,
	`nota` real DEFAULT 6 NOT NULL,
	`updatedAt` text NOT NULL,
	`createdAt` text NOT NULL,
	`deletedAt` text,
	FOREIGN KEY (`idJogador`) REFERENCES `jogadores`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`idPartida`) REFERENCES `partidas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `jogador_partida_unique` ON `estatisticas` (`idJogador`,`idPartida`);--> statement-breakpoint
CREATE TABLE `eventos` (
	`id` text PRIMARY KEY NOT NULL,
	`idPartida` text NOT NULL,
	`idJogador` text NOT NULL,
	`tipoEvento` text NOT NULL,
	`minuto` integer NOT NULL,
	`tempo` text NOT NULL,
	`detalhes` text,
	`createdAt` text NOT NULL,
	`deletedAt` text,
	FOREIGN KEY (`idPartida`) REFERENCES `partidas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`idJogador`) REFERENCES `jogadores`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `jogadores` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`numero` integer NOT NULL,
	`posicao` text NOT NULL,
	`idade` integer NOT NULL,
	`idTime` text NOT NULL,
	`fotoUrl` text,
	`fotoPath` text,
	`updatedAt` text NOT NULL,
	`createdAt` text NOT NULL,
	`deletedAt` text,
	FOREIGN KEY (`idTime`) REFERENCES `times`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `partidas` (
	`id` text PRIMARY KEY NOT NULL,
	`idTime` text NOT NULL,
	`nomeTimeAdversario` text NOT NULL,
	`data` text NOT NULL,
	`campeonato` text,
	`categoria` text NOT NULL,
	`casaOuFora` text DEFAULT 'casa' NOT NULL,
	`placarTime` integer DEFAULT 0 NOT NULL,
	`placarTimeAdversario` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'planejada',
	`resultado` text DEFAULT 'Sem_Resultado',
	`updatedAt` text NOT NULL,
	`createdAt` text NOT NULL,
	`deletedAt` text,
	FOREIGN KEY (`idTime`) REFERENCES `times`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `relatorios` (
	`id` text PRIMARY KEY NOT NULL,
	`idPartida` text NOT NULL,
	`melhorJogador` text,
	`analiseAoVivo` text,
	`sugestoesAoVivo` text,
	`pdfUrl` text,
	`updatedAt` text NOT NULL,
	`createdAt` text NOT NULL,
	`deletedAt` text,
	FOREIGN KEY (`idPartida`) REFERENCES `partidas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`melhorJogador`) REFERENCES `jogadores`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `times` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`nome` text NOT NULL,
	`categoria` text NOT NULL,
	`cidade` text NOT NULL,
	`estado` text NOT NULL,
	`escudoUrl` text,
	`escudoPath` text,
	`updatedAt` text NOT NULL,
	`createdAt` text NOT NULL,
	`deletedAt` text
);
