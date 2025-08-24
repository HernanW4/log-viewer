import { HttpClient } from "@angular/common/http";
import { Settings } from "../models/settings";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable({providedIn: 'root'})
export class SettingsService{
    private settings!: Settings;

    constructor(private http: HttpClient){}

    loadAppConfig(){
        return firstValueFrom(this.http.get<Settings>('/assets/config.json'))
        .then(config=> {
            this.settings = config;
        })
    }

    get websocketUrl(): string {
        if (!this.settings) {
            throw Error('Config not loaded');
        }
        return this.settings.websocketUrl;
    }

}