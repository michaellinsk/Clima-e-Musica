const input = document.getElementById('input-busca');
const apiKey = '2f12af0df1247082e6a3641639dc96a8';

const clientId = 'ad0e38325bd2442e9bff031834ec080a';
const clientSecret = '43de5fefbc7f424d9046c72ce31ba15c';

function movimentoInput(inputValue) {
  const visibility = input.style.visibility;

  if (inputValue) {
    procurarCidade(inputValue);
  }

  visibility === 'hidden' ? abrirInput() : fecharInput();
}

function botaoDeBusca() {
  const inputValue = input.value;
  console.log(inputValue);
  movimentoInput(inputValue);
}

function fecharInput() {
  input.style.visibility = 'hidden';
  input.style.width = '0';
  input.style.padding = '0.5rem 0.5rem 0.5rem 2.1rem';
  input.style.transition = 'all 0.5s ease-in-out';
  input.value = "";
}

function abrirInput() {
  input.style.visibility = 'visible';
  input.style.width = '300px';
  input.style.padding = '0.5rem 0.5rem 0.5rem 3.1rem';
  input.style.transition = 'all 0.5s ease-in-out';
  input.value = "";
}

input.addEventListener('keyup', function(event) {
  if (event.keyCode === 13) {
    const valorInput = input.value;
    movimentoInput(valorInput);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  fecharInput();
});

async function procurarCidade(city) {
  try {
    const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`);
  
    if (dados.status === 200) {
      const resultado = await dados.json();
      const countryCode = resultado.sys.country;
      
      obterTopAlbunsPorPais(countryCode);
      mostrarClimaNaTela(resultado);

    } else {
      throw new Error('Erro ao buscar a cidade');
    }
  } catch (error) {
    alert('A pesquisa deu errado');
    console.error(error);
  }
}

function mostrarClimaNaTela(resultado) {
  document.querySelector('.icone-tempo').src = `./assets/${resultado.weather[0].icon}.png`; 
  document.querySelector('.nome-cidade').innerHTML = `${resultado.name}`;
  document.querySelector('.temperatura').innerHTML = `${resultado.main.temp.toFixed(0)}ºC`;
  document.querySelector('.maxTemperatura').innerHTML = `Max ${resultado.main.temp_max.toFixed(0)}ºC`;
  document.querySelector('.minTemperatura').innerHTML = `Min ${resultado.main.temp_min.toFixed(0)}ºC`;
}

async function obterAcessoToken() {
  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = btoa(credentials);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${encodedCredentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials',
  });

  if (response.status === 200) {
    const data = await response.json();
    return data.access_token;
  } else {
    throw new Error('Erro ao obter token de acesso');
  }
}

async function obterTopAlbunsPorPais(countryCode) {
  const localeMapping = {
    'BR': 'pt_BR',
    'US': 'en_US',
    'GB': 'en_GB',
    'FR': 'fr_FR',
    'DE': 'de_DE',
    'IT': 'it_IT',
    'ES': 'es_ES',
    'RU': 'ru_RU',
    'JP': 'ja_JP',
    'KR': 'ko_KR',
    // Adicione mais mapeamentos conforme necessário
  };

  const locale = localeMapping[countryCode] || 'en_US'; // Usa 'en_US' como padrão se o país não for mapeado

  try {
    const accessToken = await obterAcessoToken();
    const url = `https://api.spotify.com/v1/browse/featured-playlists?locale=${locale}&limit=4`;

    const resultado = await fetch(url, {
      headers: {
        
        'Authorization': `Bearer ${accessToken}`
      },
    });

    if (resultado.status === 200) {
      const data = await resultado.json();
      const result = data.playlists.items.map(item => ({
        name: item.name,
        image: item.images[0].url
      }));
      console.log(result);
    } else {
      throw new Error('Erro ao buscar playlists');
    }
  } catch (error) {
    console.error('A pesquisa por música deu errado:', error);
  }
}
