import { EventEmitter, Injectable, Output } from '@angular/core';
import { MessageService } from '@progress/kendo-angular-l10n';

import { enComponentMessages, enCustomMessages } from '../messages/en-US';
import { heComponentMessages, heCustomMessages } from '../messages/he';

const componentMsgs = {
    ['en-US']: enComponentMessages,
    ['he-IL']: heComponentMessages,
};

const customMsgs = {
    ['en-US']: enCustomMessages,
    ['he-IL']: heCustomMessages,
};

@Injectable()
export class CustomMessagesService extends MessageService {
    @Output() public localeChange = new EventEmitter();
    private localeId;

    public set language(value: string) {
        const locale = componentMsgs[value];
        if (locale) {
            this.localeId = value;
            this.localeChange.emit();
            this.notify();
        }
    }

    public get language(): string {
        return this.localeId;
    }

    private get messages(): any {
        const messages = componentMsgs[this.localeId];
        if (messages) {
            return messages;
        }
    }

    public get(key: string): string {
        return this.messages[key];
    }

    // Translate custom messages
    public translate(word: string): string {
        const messages = customMsgs[this.localeId];
        return messages[word];
    }
}
