import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Observable} from "rxjs";

import {ServersService} from '../servers.service';
import {CanComponentDeactivate} from "./can-deactivate-guard";

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css']
})
export class EditServerComponent implements OnInit, CanComponentDeactivate {
  server: { id: number, name: string, status: string };
  serverName = '';
  serverStatus = '';
  isEditAllowed= false;
  isSaved = false;

  constructor(private serversService: ServersService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.server = this.serversService.getServer(id);
    this.serverName = this.server.name;
    this.serverStatus = this.server.status;

    this.route.params
      .subscribe((params: Params) => {
        this.server = this.serversService.getServer(+params['id']);
        this.serverName = this.server.name;
        this.serverStatus = this.server.status;
      })

    this.isEditAllowed = this.route.snapshot.queryParams['allowEdit'] === '1';
    this.route.queryParams
      .subscribe((routeParams: Params) => this.isEditAllowed = routeParams['allowEdit'] === '1');
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {name: this.serverName, status: this.serverStatus});
    this.isSaved = true;
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isEditAllowed) {
      return true;
    }

    if (!this.isSaved && (this.serverName != this.server.name || this.serverStatus != this.server.status)) {
      return confirm('You have unsaved changes! Do you want to leave the page?');
    }

    return true;
  }

}
