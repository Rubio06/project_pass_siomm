import { Routes } from "@angular/router";
import { LoginPageComponent } from "./pages/login/login-page.component";
import { AuthLayoutComponent } from "./auth-layout/auth-layout.component";
import { LoginGuard } from "./guards/LoginGuard.guard";

export const authRoutes: Routes = [

    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'login',
                component: LoginPageComponent,
            },
            {
                path: '**',
                redirectTo: 'login',
            },
        ]
    }
]
export default authRoutes;
