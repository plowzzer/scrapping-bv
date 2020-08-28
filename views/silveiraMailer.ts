import { Bid } from "../silveiraleiloes";

export default (bids: Array<Bid>) => {
  if (!bids) {
    return "error";
  }

  var mail = `
  <table
    role="presentation"
    border="0"
    cellpadding="0"
    cellspacing="0"
  >
    <tr>
      <td>
        <h2>Olá, espero que você esteja bem!</h2>
        <p>
          Encontrei novos leilões de terrenos e glebas dentro do
          SilveiraLeilões.com.br
        </p>
      </td>
    </tr>
  </table>`;

  bids.forEach((bid) => {
    mail += `
    <table
      role="presentation"
      border="0"
      cellpadding="0"
      cellspacing="0"
      class="btn btn-primary"
    >
      <tbody>
        <tr>
          <td align="left"><b>Nome:</b></td>
          <td>${bid.name}</td>
        </tr>
        <tr>
          <td align="left"><b>Status:</b></td>
          <td>${bid.status}</td>
        </tr>
        <tr>
          <td align="left"><b>Tipo:</b></td>
          <td>${bid.type}</td>
        </tr>
        <tr>
          <td align="left"><b>Descrição:</b></td>
          <td>${bid.description}</td>
        </tr>
        <tr>
          <td align="left"><b>Preços:</b></td>
          <td>${bid.prices}</td>
        </tr>
      </tbody>
    </table>

    <table
      role="presentation"
      border="0"
      cellpadding="0"
      cellspacing="0"
      class="btn btn-primary"
    >
      <tbody>
        <tr>
          <td align="left">
            <table
              role="presentation"
              border="0"
              cellpadding="0"
              cellspacing="0"
            >
              <tbody>
                <tr>
                  <td>
                    <a
                      href="${bid.link}"
                      target="_blank"
                      >Ver mais</a
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    `;
  });

  return mail;
};
