import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
    isLoading = false;
    subscription = new Subscription();

    constructor(private loginService: LoginService) { }
    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }

    ngOnInit(): void {
        this.subscription.add(this.loginService.isHidden.subscribe(isHidden => {
            if(isHidden){
                this.isLoading = false;
            }
        }));
    }

    onClick() {
        this.isLoading = true;
        this.loginService.isHiddenClicked(false);
    }
}
