import { Injectable } from '@nestjs/common';
import loginDto from 'src/Dtos/loginDto';
import registerDto from 'src/Dtos/registerDto';
import clientReturner from 'src/utils/clientReturner';

@Injectable()
export class UserService {

    async login(data: loginDto) {
        return 'User '+data.email+' logged'
    }
    async register(data: registerDto) {
        const conn = clientReturner()
        await conn.connect()
        const sql = `INSERT INTO public.glpi_sexp_users
        (first_name, last_name, email, activated, "admin", date_activated)
        VALUES('${data.first_name}', '${data.last_name}', '${data.email}', false, ${data.admin}, NOW()) RETURNING user_id;`
        const rows = await conn.query(sql)
        const user_id = rows.rows[0]['user_id']
        data.permisos.forEach( async (e) => {
            const sql2 = `INSERT INTO public.glpi_sexp_user_empresa
            (empresa_id, user_id)
            VALUES(${e}, ${user_id});`
            await conn.query(sql2)
        });

        setTimeout(() => {
            conn.end()
        }, 500);
        
        return 'Usuario creado: '+data.email
    }
    async activateU (id: number) {
        const conn = clientReturner()
        await conn.connect()
        const sql = `UPDATE public.glpi_sexp_users SET activated=true WHERE user_id=${id};`
        await conn.query(sql)
        await conn.end()
        return 'User activated: '+id
    }
    async deactivateU (id: number) {
        const conn = clientReturner()
        await conn.connect()
        const sql = `UPDATE public.glpi_sexp_users SET activated=false WHERE user_id=${id};`
        await conn.query(sql)
        await conn.end()
        return 'User deactivated: '+id
    }
}
