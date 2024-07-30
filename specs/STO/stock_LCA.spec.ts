/**
 * 
 * PRICING APPLICATION > CONNEXION
 * 
 * @author Vazoumana Diarrassouba
 * @since 2023/10/13
 * 
 */
const xRefTest      = "STO_LCA_CHK";
const xDescription  = "Examine la Liste de Contrôle d'Accès STOCK";
const xIdTest       =  1614;
const xVersion      = '3.3';

var info:CartoucheInfo = {
    desc        : xDescription,
    appli       : 'STOCK',
    version     : xVersion,
    refTest     : [xRefTest],
    idTest      : xIdTest,
    help        : [],
    params      : [],
    fileName    : __filename
};

//------------------------------------------------------------------------------------

import { test, type Page, expect }          from '@playwright/test';

import { Help }                             from '@helpers/helpers.js';
import { TestFunctions }                    from '@helpers/functions.js';
import { Log }                              from '@helpers/log';

import { Credential }                       from '@conf/environnements/credential.conf.js';

import { Authentificationpage }             from '@pom/COMMUN/authentification.page.js';

import { MenuStock }                        from '@pom/STO/menu.page.js';
import { CartoucheInfo }                    from '@commun/types/index.js';

//------------------------------------------------------------------------------------
test.describe.configure({ mode: 'serial' });

let page                : Page;
let pageObjectAuth      : Authentificationpage;
let menu                : MenuStock;

const log				= new Log();
const fonction      	= new TestFunctions(log);

const profil            = 'lunettes';
const userCredential    = new Credential(profil);

var profilData          = userCredential.getData();
//------------------------------------------------------------------------------------

test.beforeAll(async ({ browser }, testInfo) => {
    page                = await browser.newPage();    
    pageObjectAuth      = new Authentificationpage(page);
    menu                = new MenuStock(page);
	const helper    	= new Help(info, testInfo, page);
	await helper.init();
});

test.afterAll(async ({}, testInfo) => {
    await fonction.close(testInfo);
})

//------------------------------------------------------------------------------------

test.describe.serial ('[' + xRefTest + ']', () => {

    var injects			=  [
        [false, '', ''],
        [false, 'Foo', 'Bar'],
        [false, profilData.login, ''],
        [false, '', profilData.password],
        [false, "' or '1' = '1", "' or '1' = '1"],
        [false, "' OR 1=1'); //", "' OR 1=1'); //"]
    ];

    test('Ouverture URL', async({ context }) => {
        await context.clearCookies();
        await fonction.openUrl(page);
    });

    test.describe('Login - Wrong Parameters', async () => {

        var index = 0

		injects.forEach(async (data) => {

			var expected	= data[0]
			var login 		= data[1];
			var password 	= data[2];

			test('Login: [ ' + login + ' ] / Pwd: [ ' + password + ' ]', async () => {
                await pageObjectAuth.setJUsername(login);
                await pageObjectAuth.setJPassword(password);
                await pageObjectAuth.clickConnexionButton(page);
				expect(pageObjectAuth.isErrorDisplayed() == expected);
                index++
                // Quand nous avons ces coordonnées: login = "' OR 1=1'); //" et password = "' OR 1=1'); //"
                // Nous avons un gros messages d'erreur qui rend le bouton <<connexion>> invisible, d'où il faut faire le rafraîchissement de la page
                if(index == (injects.length)){   
                    await page.reload();
                    fonction.waitTillHTMLRendered(page);
                }
			}); 
		});
	});    

    test.describe('Login - Right Parameters >', async () => {

		var login 		= profilData.login;
		var password	= profilData.password;
		
		test('Login: [ ' + login + ' ] / Pwd: [ ' + password + ' ]', async () => {
			await pageObjectAuth.setJUsername(login);
			await pageObjectAuth.setJPassword(password);
			await pageObjectAuth.clickConnexionButton(page);
           				  
		})

        test('ListBox [USER] - Is Visible', async () => {
            menu.listBoxUser.isVisible()
        })

	})
   
    test('Déconnexion', async () => {
        await fonction.deconnexion(page);
    });

})