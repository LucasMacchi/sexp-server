import { Injectable, UnauthorizedException } from '@nestjs/common';
import loginDto from 'src/Dtos/loginDto';
import registerDto from 'src/Dtos/registerDto';
import clientReturner from 'src/utils/clientReturner';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(private JwtService: JwtService){}

    async addCredential (id: number, empresa: number) {
        const sql = `INSERT INTO public.glpi_sexp_user_empresa
        (empresa_id, user_id) VALUES(${empresa}, ${id});`
        const conn = clientReturner()
        await conn.connect()
        await conn.query(sql)
        await conn.end()
        return 'Credenciales modificadas.'
    }
    async deleteCredential (id: number){
        const conn = clientReturner()
        await conn.connect()
        const sql = `DELETE FROM public.glpi_sexp_user_empresa WHERE user_empresa_id=${id};`
        await conn.query(sql)
        await conn.end()
        return 'Credencial eliminada.'
    }
    async getAll () {
        const conn = clientReturner()
        await conn.connect()
        const sql = `SELECT * FROM public.glpi_sexp_users;`
        const sql2 = `SELECT * FROM public.glpi_sexp_user_empresa;`
        const users = (await conn.query(sql)).rows
        const credentials = (await conn.query(sql2)).rows
        users.forEach(u => {
            const arr = credentials.filter((c) => u['user_id'] === c['user_id'])
            u['credentials'] = arr
        });
        await conn.end()
        return users
    }
    async login(data: loginDto) {
        const conn = clientReturner()
        await conn.connect()
        const sql = `SELECT user_id, email, activated, "admin" FROM public.glpi_sexp_users WHERE email = '${data.email}';`
        const rows = await conn.query(sql)
        const userData = rows.rows[0]
        const sql2 = `SELECT * FROM public.glpi_sexp_user_empresa WHERE user_id = ${userData['user_id']};`
        const credentials = (await conn.query(sql2)).rows
        userData['credentials'] = credentials
        await conn.end()
        if(userData && userData['activated']){
            return this.JwtService.sign(userData)
        }
        else {
            throw UnauthorizedException
        }
    }
    async register(data: registerDto) {
        const conn = clientReturner()
        await conn.connect()
        const sql = `INSERT INTO public.glpi_sexp_users
        (first_name, last_name, email, activated, "admin", date_activated)
        VALUES('${data.first_name}', '${data.last_name}', '${data.email}', false, ${data.admin}, NOW()) RETURNING user_id;`
        await conn.query(sql)
        await conn.end()
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
