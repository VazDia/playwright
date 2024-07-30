/**
 * 
 * Classe dédiée aux appels à la base Elasticsearch
 * 
 * @author Mathis NGUYEN
 * @version 3.2
 * @description Récupère les logs d'erreur côté serveur
 *  
 */

import { Client } from '@elastic/elasticsearch';

export class ElkFunctions {

    public url      : string;
    private client  : Client;

    //-- Liste des codes recherchés
    static codeExceptions = [
        { value: 9999, type: "CodeException 9999" }
    ];

    //-- Liste des libellés recherché dans les lignes de Log
    static otherExceptions = [
        { value: "*org.hibernate.LazyInitializationException*", type: "LazyInitializationException" },
        //{ value: "*org.hibernate.exception.SQLGrammarException*", type: "SQLGrammarException" },
        { value: "*java.lang.NullPointerException*", type: "NullPointerException" }
    ];

    constructor() {
        this.url = 'http://172.30.20.42:9200';
        this.client = new Client({ node: this.url });
    }

    /**
     * 
     * @param search_index Environnement (INT, INT2, etc.)
     * @param app Nom de l'application
     * @param startDate Date de début de l'examane des logs
     * @param endDate Date de fin de l'examen des logs
     * @param codeValue L'erreur recherchée
     * @returns Réponse du serveur
     */
    public async searchCodeExceptions(search_index: string, app: string, startDate: string, endDate: string, codeValue: any):Promise<any|null> {
        try {
            const response = await this.client.search({
                index: search_index,
                body: {
                    query: {
                        bool: {
                            filter: [
                                {
                                    range: {
                                        "@timestamp": {
                                            gte: startDate,
                                            lte: endDate
                                        }
                                    }
                                },
                                {
                                    term: {
                                        application: app
                                    }
                                }
                            ],
                            should: [
                                {
                                    term: {
                                        codeException: codeValue
                                    }
                                }
                            ],
                            minimum_should_match: 1
                        }
                    }
                }
            });
            return response.body.hits.hits.length > 0 ? response.body.hits.hits : null;
        } catch (error) {
            console.error(`Error occurred during the search for codeException: ${codeValue}`, error);
            return null;
        }
    }

    /**
     * 
     * @param search_index Environnement (INT, INT2, etc.)
     * @param app Nom de l'application
     * @param startDate Date de début de l'examane des logs
     * @param endDate Date de fin de l'examen des logs
     * @param codeValue L'erreur recherchée
     * @returns Réponse du serveur
     */
    public async searchOtherExceptions(search_index: string, app: string, startDate: string, endDate: string, exceptionType: string):Promise<any|null> {
        try {
            const response = await this.client.search({
                index: search_index,
                body: {
                    query: {
                        bool: {
                            filter: [
                                {
                                    range: {
                                        "@timestamp": {
                                            gte: startDate,
                                            lte: endDate
                                        }
                                    }
                                },
                                {
                                    term: {
                                        application: app
                                    }
                                }
                            ],
                            should: [
                                {
                                    query_string: {
                                        default_field: "messageLog",
                                        query: exceptionType
                                    }
                                }
                            ],
                            minimum_should_match: 1
                        }
                    }
                }
            });
            return response.body.hits.hits.length > 0 ? response.body.hits.hits : null;
        } catch (error) {
            console.error(`Error occurred during the search for ${exceptionType}:`, error);
            return null;
        }

    }

}