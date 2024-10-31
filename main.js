// main.js
import { app } from 'electron';
import { createHandlers } from './handlers/handlers.mjs';
import { createWindow } from './interface/window.mjs';

app.whenReady().then(() => {
    createWindow();
    createHandlers();
});
