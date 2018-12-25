import { NgModule } from '@angular/core';
import { CheckSessionComponent } from './check-session/check-session';
import { UserInfoComponent } from './user-info/user-info';
@NgModule({
	declarations: [CheckSessionComponent,
    UserInfoComponent],
	imports: [],
	exports: [CheckSessionComponent,
    UserInfoComponent]
})
export class ComponentsModule {}
