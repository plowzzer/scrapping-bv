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
        <h1>Descobrimos novas oportunidades!</h1>
        <p>
          Dá só uma olhada nos terrenos e glebas que encontramos
          no <i>SilteiraLeiloes.com.br</i>
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
          <td class="title" colspan="2">
            ${bid.name}
          </td>
        </tr>
        <tr>
          <td class="details" align="left">
            <span>${bid.status}</span> - <span>${bid.type}</span>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <p style="margin-bottom: 0">
              ${bid.description}
            </p>
          </td>
        </tr>
        <table
          role="presentation"
          border="0"
          cellpadding="10"
          cellspacing="15"
        >
          <tr>`;

    bid.prices.map((price) => {
      mail += `<td class="price">`;
      if (price.date) {
        mail += `<span class="details">${price.date}</span>`;
      }
      if (price.value) {
        mail += `<p class="final">R$ ${price.value}</p>`;
      }
      mail += `</td>`;
    });

    mail += `</tr>
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
              <td align="right">
                <table
                  role="presentation"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                >
                  <tbody>
                    <tr>
                      <td align="right">
                        <a href="${bid.link}" target="_blank">
                          Ver mais
                        </a>
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

  mail += `</tbody>
  </table>`;

  return mail;
};
