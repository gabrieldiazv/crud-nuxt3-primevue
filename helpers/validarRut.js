// export default function validarRut(rut) {
//   rut = rut.replace(/[^0-9kK]/g, '') // Eliminar caracteres no numéricos ni la letra 'k'

//   if (rut.length < 9) {
//     return false
//   }

//   var cuerpo = rut.slice(0, -1) // Obtener el cuerpo del RUT (sin dígito verificador)
//   var dv = rut.slice(-1).toUpperCase() // Obtener el dígito verificador en mayúscula

//   // Calcular el dígito verificador esperado
//   var suma = 0
//   var multiplo = 2

//   for (var i = cuerpo.length - 1; i >= 0; i--) {
//     suma += parseInt(cuerpo.charAt(i)) * multiplo

//     if (multiplo < 7) {
//       multiplo += 1
//     } else {
//       multiplo = 2
//     }
//   }

//   var dvEsperado = 11 - (suma % 11)

//   if (dvEsperado === 11) {
//     dvEsperado = '0'
//   } else if (dvEsperado === 10) {
//     dvEsperado = 'K'
//   } else {
//     dvEsperado = dvEsperado.toString()
//   }

//   return dv === dvEsperado
// }

export default function validarRut(rutCompleto) {
  rutCompleto = rutCompleto.replace("‐","-");
  if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test( rutCompleto ))
    return false;
  var tmp 	= rutCompleto.split('-');
  var digv	= tmp[1]; 
  var rut 	= tmp[0];
  if ( digv == 'K' ) digv = 'k' ;
  
  return (dv(rut) == digv );
}

const dv =(T) =>{
  var M=0,S=1;
  for(;T;T=Math.floor(T/10))
    S=(S+T%10*(9-M++%6))%11;
  return S?S-1:'k';
}