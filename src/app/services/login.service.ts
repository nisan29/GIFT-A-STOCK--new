import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private isHidden$ = new BehaviorSubject(null);
    readonly isHidden = this.isHidden$.asObservable();

    private giftDetails$ = new BehaviorSubject(null);
    readonly giftDetails = this.giftDetails$.asObservable();

    isHiddenClicked(clicked: boolean) {
        this.isHidden$.next(clicked);
    }
    
    sentGiftDetails(data){
        this.giftDetails$.next(data);
    }
}