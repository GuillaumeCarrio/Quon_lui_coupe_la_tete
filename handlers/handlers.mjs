import { ipcMain, Notification, dialog } from 'electron';
import fs from 'fs';
import path from 'path';

export function createHandlers() {
    ipcMain.on('file:save', async (event, gameData) => {
        try {
            const { canceled, filePath } = await dialog.showSaveDialog({
                title: 'Sauvegarder la Partie',
                defaultPath: path.join(app.getPath('documents'), 'sauvegarde_pendu.json'),
                filters: [{ name: 'JSON Files', extensions: ['json'] }]
            });

            if (!canceled && filePath) {
                await fs.promises.writeFile(filePath, JSON.stringify(gameData), 'utf-8');
                event.reply('save-success', 'La partie a été sauvegardée avec succès.');
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du fichier:', error);
            event.reply('save-failure', 'Échec de la sauvegarde de la partie.');
        }
    });

    ipcMain.handle('file:load', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            title: 'Charger une Partie',
            defaultPath: app.getPath('documents'),
            filters: [{ name: 'JSON Files', extensions: ['json'] }],
            properties: ['openFile']
        });

        if (!canceled && filePaths.length > 0) {
            const data = await fs.promises.readFile(filePaths[0], 'utf-8');
            return JSON.parse(data);
        }
        return null;
    });

    ipcMain.on('notification:win', () => {
        new Notification({ title: 'Jeu du Pendu', body: 'Bravo ! Tu as gagné !' }).show();
    });

    ipcMain.on('notification:lose', () => {
        new Notification({ title: 'Jeu du Pendu', body: 'Dommage ! Tu as perdu !' }).show();
    });
}
