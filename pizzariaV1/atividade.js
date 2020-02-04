const atividade = (aluno, tipo, topologia) => {
    let tipoRede = tipo; // WAN
    let topologiaRede = topologia; // P2P
    console.log('Aluno:' + aluno + ' => Tipo: ' + tipoRede + ' Topologia: ' + topologiaRede)
}

atividade('Lucas', 'WAN', 'P2P')
atividade('Emerson', 'MAN', 'ESTRELA')
atividade('Ranye', 'LAN', 'ANEL')
atividade('Vínicius', 'VPN', 'BARRAMENTO')


