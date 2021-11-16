import { AfterViewInit, Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { FormModel } from 'src/app/models/form.model';

import { SelectEvent, FileRestrictions } from '@progress/kendo-angular-upload';
import { CustomMessagesService } from 'src/app/services/custom-messages.service';
import { MessageService } from '@progress/kendo-angular-l10n';
import { NotificationService } from '@progress/kendo-angular-notification';

@Component({
    selector: 'app-profile-component',
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements AfterViewInit {
    public formGroup: FormGroup;
    public phoneNumberMask = '000-0000000';
    public fileRestrictions: FileRestrictions = {
        allowedExtensions: ['.png', '.jpeg', '.jpg']
    };
    public avatars: NodeList;

    public formValue: FormModel | null = {
        avatar: [''],
        firstName: 'ניסן',
        lastName: 'שמיר',
        email: 'nisans@tase.com',
        phoneNumber: '054-7747316',
        birthDate: '01/03/1990'
    };

    public customMsgService: CustomMessagesService;

    constructor(public msgService: MessageService, private notificationService: NotificationService) {
        this.setFormValues();
        this.customMsgService = this.msgService as CustomMessagesService;
    }

    ngAfterViewInit() {
        this.setAvatar();
    }

    public setFormValues() {
        const form = localStorage.getItem('form');
        if (form) {
            this.formValue = JSON.parse(form);
        }

        this.formGroup = new FormGroup({
            avatar: new FormControl(this.formValue.avatar, [Validators.required]),
            firstName: new FormControl(this.formValue.firstName, [Validators.required]),
            lastName: new FormControl(this.formValue.lastName, [Validators.required]),
            email: new FormControl(this.formValue.email, [Validators.required, Validators.email]),
            phoneNumber: new FormControl(this.formValue.phoneNumber, [Validators.required]),
            birthDate: new FormControl(this.formValue.birthDate, [Validators.required])
        });
    }

    public setAvatar() {
        this.avatars = document.querySelectorAll('.k-avatar .k-avatar-image');
        const avatarImg = localStorage.getItem('avatar');
        if (avatarImg) {
            this.avatars.forEach((avatar: HTMLElement, index:number) => {
                if(index > 0){
                    avatar.style['background-image'] = `url("${avatarImg}")`;
                }
            });
        }
    }

    public saveChanges(): void {
        this.formGroup.markAllAsTouched();
        const formValues = JSON.stringify(this.formGroup.value);
        localStorage.setItem('form', formValues);

        this.formGroup.markAsPristine();

        this.notificationService.show({
            content: 'המידע האישי נשמר בהצלחה',
            animation: { type: 'slide', duration: 500 },
            position: { horizontal: 'center', vertical: 'bottom' },
            type: { style: 'success', icon: true },
            hideAfter: 2000
        });
    }

    public cancelChanges(): void {
        this.setFormValues();
    }

    public isFileAllowed(file): boolean {
        return this.fileRestrictions.allowedExtensions.includes(file.extension);
    }

    public selectAvatar(ev: SelectEvent): void {
        const avatars = this.avatars;
        const  reader = new FileReader();
        const file = ev.files[0];
        if (file.rawFile && this.isFileAllowed(file)) {
            reader.onloadend = function() {
                avatars.forEach((avatar: HTMLElement) => {
                    avatar.style['background-image'] = `url("${this.result}")`;
                    localStorage.setItem('avatar', this.result.toString());
                });
            };
            reader.readAsDataURL(file.rawFile);
        }
    }
}
