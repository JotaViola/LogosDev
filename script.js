/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const STORAGE_KEY = "projetosEmpresa";


const STATUS = {

    solicitado:
        "Projeto Solicitado",

    "nao-iniciado":
        "Não Iniciado",

    andamento:
        "Em Andamento",

    concluido:
        "Concluído",

    rejeitado:
        "Rejeitado"

};


/* =========================================================
   FUNÇÕES DE LOCALSTORAGE
========================================================= */

function obterProjetos() {

    try {

        const dados =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!dados) {

            return [];

        }

        const projetos =
            JSON.parse(dados);

        if (!Array.isArray(projetos)) {

            return [];

        }

        return projetos;

    } catch (erro) {

        console.error(
            "Erro ao carregar projetos:",
            erro
        );

        return [];

    }

}


function salvarProjetos(projetos) {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(projetos)
        );

        return true;

    } catch (erro) {

        console.error(
            "Erro ao salvar projetos:",
            erro
        );

        alert(
            "Não foi possível salvar os dados."
        );

        return false;

    }

}


/* =========================================================
   ID
========================================================= */

function gerarId() {

    return Date.now().toString() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 9);

}


/* =========================================================
   SEGURANÇA HTML
========================================================= */

function escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   DATA
========================================================= */

function formatarData(data) {

    if (!data) {

        return "-";

    }


    const partes =
        data.split("-");


    if (partes.length !== 3) {

        return data;

    }


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


/* =========================================================
   FORMULÁRIO DO SITE
========================================================= */

const projectForm =
    document.getElementById(
        "projectForm"
    );


if (projectForm) {

    projectForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const projeto = {

                id:
                    gerarId(),

                cliente:
                    document
                        .getElementById(
                            "clienteNome"
                        )
                        .value
                        .trim(),

                empresa:
                    document
                        .getElementById(
                            "clienteEmpresa"
                        )
                        .value
                        .trim(),

                email:
                    document
                        .getElementById(
                            "clienteEmail"
                        )
                        .value
                        .trim(),

                telefone:
                    document
                        .getElementById(
                            "clienteTelefone"
                        )
                        .value
                        .trim(),

                nome:
                    document
                        .getElementById(
                            "projetoNome"
                        )
                        .value
                        .trim(),

                tipo:
                    document
                        .getElementById(
                            "projetoTipo"
                        )
                        .value,

                prazo:
                    document
                        .getElementById(
                            "prazoDesejado"
                        )
                        .value,

                descricao:
                    document
                        .getElementById(
                            "projetoDescricao"
                        )
                        .value
                        .trim(),

                github:
                    "",

                link:
                    "",

                inicio:
                    "",

                observacoes:
                    "",

                status:
                    "solicitado",

                criadoEm:
                    new Date()
                        .toISOString()

            };


            const projetos =
                obterProjetos();


            projetos.push(
                projeto
            );


            const salvou =
                salvarProjetos(
                    projetos
                );


            if (!salvou) {

                return;

            }


            projectForm.reset();


            const modal =
                document.getElementById(
                    "successModal"
                );


            if (modal) {

                modal.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   MODAL DE SUCESSO
========================================================= */

function fecharModal() {

    const modal =
        document.getElementById(
            "successModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   KANBAN
========================================================= */

function renderKanban() {

    const colunas = [

        "solicitado",

        "nao-iniciado",

        "andamento",

        "concluido",

        "rejeitado"

    ];


    const projetos =
        obterProjetos();


    /* Limpar colunas */

    colunas.forEach(
        function(status) {

            const coluna =
                document.getElementById(
                    status
                );


            if (coluna) {

                coluna.innerHTML = "";

            }

        }
    );


    const contadores = {

        solicitado:
            0,

        "nao-iniciado":
            0,

        andamento:
            0,

        concluido:
            0,

        rejeitado:
            0

    };


    projetos.forEach(
        function(projeto) {

            /* Corrigir projetos antigos */

            if (
                !Object.prototype.hasOwnProperty.call(
                    contadores,
                    projeto.status
                )
            ) {

                projeto.status =
                    "solicitado";

            }


            contadores[
                projeto.status
            ]++;


            const card =
                criarCardProjeto(
                    projeto
                );


            const coluna =
                document.getElementById(
                    projeto.status
                );


            if (coluna) {

                coluna.appendChild(
                    card
                );

            }

        }
    );


    salvarProjetos(
        projetos
    );


    atualizarContadores(
        contadores
    );

}


/* =========================================================
   CARD
========================================================= */

function criarCardProjeto(
    projeto
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "project-card";


    card.draggable =
        true;


    card.dataset.id =
        projeto.id;


    card.addEventListener(
        "dragstart",
        dragStart
    );


    card.addEventListener(
        "dragend",
        dragEnd
    );


    card.innerHTML = `

        <h3>
            ${escaparHTML(
                projeto.nome
            )}
        </h3>

        <div class="card-client">

            Cliente:

            <strong>
                ${escaparHTML(
                    projeto.cliente
                )}
            </strong>

        </div>

        <span class="card-type">

            ${escaparHTML(
                projeto.tipo
            )}

        </span>

        <div class="card-footer">

            <span class="card-date">

                Prazo:
                ${formatarData(
                    projeto.prazo
                )}

            </span>

            <button
                type="button"
                class="edit-card"
            >
                Editar
            </button>

        </div>

    `;


    const editar =
        card.querySelector(
            ".edit-card"
        );


    editar.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            abrirProjeto(
                projeto.id
            );

        }
    );


    return card;

}


/* =========================================================
   DRAG & DROP
========================================================= */

let draggedProjectId =
    null;


function dragStart(event) {

    draggedProjectId =
        event.currentTarget.dataset.id;


    event.currentTarget.classList.add(
        "dragging"
    );


    event.dataTransfer.effectAllowed =
        "move";


    event.dataTransfer.setData(
        "text/plain",
        draggedProjectId
    );

}


function dragEnd(event) {

    event.currentTarget.classList.remove(
        "dragging"
    );

}


function allowDrop(event) {

    event.preventDefault();

    event.dataTransfer.dropEffect =
        "move";

}


function drop(event) {

    event.preventDefault();


    const novaStatus =
        event.currentTarget.id;


    if (
        !Object.prototype.hasOwnProperty.call(
            STATUS,
            novaStatus
        )
    ) {

        return;

    }


    let id =
        draggedProjectId;


    if (!id) {

        id =
            event.dataTransfer.getData(
                "text/plain"
            );

    }


    if (!id) {

        return;

    }


    const projetos =
        obterProjetos();


    const projeto =
        projetos.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!projeto) {

        return;

    }


    projeto.status =
        novaStatus;


    salvarProjetos(
        projetos
    );


    draggedProjectId =
        null;


    renderKanban();

}


/* =========================================================
   CONTADORES
========================================================= */

function atualizarContadores(
    contadores
) {

    const total =
        Object.values(
            contadores
        ).reduce(
            function(
                soma,
                numero
            ) {

                return soma + numero;

            },
            0
        );


    document.getElementById(
        "totalProjetos"
    ).textContent =
        total;


    document.getElementById(
        "totalSolicitados"
    ).textContent =
        contadores.solicitado;


    document.getElementById(
        "totalNaoIniciados"
    ).textContent =
        contadores[
            "nao-iniciado"
        ];


    document.getElementById(
        "totalAndamento"
    ).textContent =
        contadores.andamento;


    document.getElementById(
        "totalConcluidos"
    ).textContent =
        contadores.concluido;


    document.getElementById(
        "totalRejeitados"
    ).textContent =
        contadores.rejeitado;


    document.getElementById(
        "count-solicitado"
    ).textContent =
        contadores.solicitado;


    document.getElementById(
        "count-nao-iniciado"
    ).textContent =
        contadores[
            "nao-iniciado"
        ];


    document.getElementById(
        "count-andamento"
    ).textContent =
        contadores.andamento;


    document.getElementById(
        "count-concluido"
    ).textContent =
        contadores.concluido;


    document.getElementById(
        "count-rejeitado"
    ).textContent =
        contadores.rejeitado;

}


/* =========================================================
   ABRIR PROJETO
========================================================= */

function abrirProjeto(id) {

    const projetos =
        obterProjetos();


    const projeto =
        projetos.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!projeto) {

        return;

    }


    document.getElementById(
        "editId"
    ).value =
        projeto.id;


    document.getElementById(
        "editNome"
    ).value =
        projeto.nome || "";


    document.getElementById(
        "editTipo"
    ).value =
        projeto.tipo || "";


    document.getElementById(
        "editCliente"
    ).value =
        projeto.cliente || "";


    document.getElementById(
        "editEmpresa"
    ).value =
        projeto.empresa || "";


    document.getElementById(
        "editEmail"
    ).value =
        projeto.email || "";


    document.getElementById(
        "editTelefone"
    ).value =
        projeto.telefone || "";


    document.getElementById(
        "editInicio"
    ).value =
        projeto.inicio || "";


    document.getElementById(
        "editPrazo"
    ).value =
        projeto.prazo || "";


    document.getElementById(
        "editGithub"
    ).value =
        projeto.github || "";


    document.getElementById(
        "editLink"
    ).value =
        projeto.link || "";


    document.getElementById(
        "editStatus"
    ).value =
        projeto.status ||
        "solicitado";


    document.getElementById(
        "editDescricao"
    ).value =
        projeto.descricao || "";


    document.getElementById(
        "editObservacoes"
    ).value =
        projeto.observacoes || "";


    document.getElementById(
        "projectModal"
    ).classList.add(
        "active"
    );

}


/* =========================================================
   SALVAR ALTERAÇÕES
========================================================= */

const editProjectForm =
    document.getElementById(
        "editProjectForm"
    );


if (editProjectForm) {

    editProjectForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const id =
                document.getElementById(
                    "editId"
                ).value;


            const projetos =
                obterProjetos();


            const projeto =
                projetos.find(
                    function(item) {

                        return item.id === id;

                    }
                );


            if (!projeto) {

                return;

            }


            projeto.nome =
                document
                    .getElementById(
                        "editNome"
                    )
                    .value
                    .trim();


            projeto.tipo =
                document
                    .getElementById(
                        "editTipo"
                    )
                    .value
                    .trim();


            projeto.cliente =
                document
                    .getElementById(
                        "editCliente"
                    )
                    .value
                    .trim();


            projeto.empresa =
                document
                    .getElementById(
                        "editEmpresa"
                    )
                    .value
                    .trim();


            projeto.email =
                document
                    .getElementById(
                        "editEmail"
                    )
                    .value
                    .trim();


            projeto.telefone =
                document
                    .getElementById(
                        "editTelefone"
                    )
                    .value
                    .trim();


            projeto.inicio =
                document
                    .getElementById(
                        "editInicio"
                    )
                    .value;


            projeto.prazo =
                document
                    .getElementById(
                        "editPrazo"
                    )
                    .value;


            projeto.github =
                document
                    .getElementById(
                        "editGithub"
                    )
                    .value
                    .trim();


            projeto.link =
                document
                    .getElementById(
                        "editLink"
                    )
                    .value
                    .trim();


            projeto.status =
                document
                    .getElementById(
                        "editStatus"
                    )
                    .value;


            projeto.descricao =
                document
                    .getElementById(
                        "editDescricao"
                    )
                    .value
                    .trim();


            projeto.observacoes =
                document
                    .getElementById(
                        "editObservacoes"
                    )
                    .value
                    .trim();


            salvarProjetos(
                projetos
            );


            fecharProjeto();


            renderKanban();

        }
    );

}


/* =========================================================
   FECHAR PROJETO
========================================================= */

function fecharProjeto() {

    const modal =
        document.getElementById(
            "projectModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   EXCLUIR PROJETO
========================================================= */

function excluirProjeto() {

    const id =
        document.getElementById(
            "editId"
        ).value;


    if (!id) {

        return;

    }


    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este projeto?"
        );


    if (!confirmar) {

        return;

    }


    let projetos =
        obterProjetos();


    projetos =
        projetos.filter(
            function(projeto) {

                return projeto.id !== id;

            }
        );


    salvarProjetos(
        projetos
    );


    fecharProjeto();


    renderKanban();

}


/* =========================================================
   FECHAR MODAIS AO CLICAR FORA
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const successModal =
            document.getElementById(
                "successModal"
            );


        if (
            successModal &&
            event.target ===
                successModal
        ) {

            fecharModal();

        }


        const projectModal =
            document.getElementById(
                "projectModal"
            );


        if (
            projectModal &&
            event.target ===
                projectModal
        ) {

            fecharProjeto();

        }

    }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /*
         * Só executa o Kanban se
         * estivermos na página administrativa.
         */

        if (
            document.getElementById(
                "admin-body"
            )
        ) {

            renderKanban();

        }


        /*
         * A verificação abaixo é feita
         * pelo elemento adminPanel.
         */

        if (
            document.getElementById(
                "adminPanel"
            )
        ) {

            renderKanban();

        }

    }
);
