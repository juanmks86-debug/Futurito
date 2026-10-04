// Cuadrantes del mapa de Ikigai
export const QUADRANTS = [
 {id:"p",t:"Lo que amo",s:"Pasión: ¿qué temas o tecnologías te apasionan?",k:"var(--c1)"},
 {id:"t",t:"En lo que soy bueno",s:"Talento: ¿cuáles son tus habilidades naturales?",k:"var(--c2)"},
 {id:"m",t:"Lo que Jujuy necesita",s:"Misión: ¿qué desafío de tu localidad querés resolver?",k:"var(--c3)"},
 {id:"v",t:"Mi modelo de valor",s:"Viabilidad: ¿por qué solución pagarían o invertirían en vos?",k:"var(--c4)"}];

// Carreras de EJEMPLO: reemplazar por la oferta real de Jujuy.
// [nombre, tipo, palabras clave, pasos para explorar]
const RAW = [
 ["Informática y programación","Tecnicatura, Analista o Ingeniería",["computadora","programar","videojuego","internet","redes","tecnologia","app","logica","robot","software","pagina","web","conectividad"],["Mirá los planes de estudio de Analista Programador y de las tecnicaturas en informática.","Probá un curso corto gratuito de programación.","Hablá con alguien que trabaje en sistemas o redes."]],
 ["Ciencia de datos e IA","Tecnicatura o Licenciatura",["datos","numero","estadistica","inteligencia","matematica","grafico","prediccion","analisis","excel"],["Probá un curso introductorio de Python o análisis de datos.","Buscá una tecnicatura en ciencia de datos cerca tuyo.","Analizá algo que te interese con una planilla."]],
 ["Electrónica y electricidad","Técnico o Ingeniería",["arreglar","electricidad","circuito","reparar","instalar","motor","drone","placa","energia","solar"],["Visitá una escuela técnica o un taller.","Armá un proyecto chico con Arduino.","Hablá con un técnico o instalador."]],
 ["Enfermería y salud","Tecnicatura o Licenciatura",["cuidar","salud","ayudar","hospital","paciente","medicina","bienestar","primeros","auxilios"],["Averiguá los requisitos de ingreso a enfermería.","Hablá con alguien que trabaje en un centro de salud.","Hacé un curso de primeros auxilios."]],
 ["Educación y psicopedagogía","Profesorado o Licenciatura",["ensenar","explicar","ninos","escuela","paciencia","escuchar","ayudar","clases","apoyo"],["Dá una clase de apoyo a alguien para probar.","Mirá profesorados de tu zona.","Hablá con un docente sobre su día a día."]],
 ["Psicología y trabajo social","Licenciatura",["escuchar","personas","emocion","comunidad","ayudar","conversar","jovenes","familia","social"],["Participá de una actividad comunitaria o voluntariado.","Leé el plan de estudio de la licenciatura.","Hablá con un profesional del área."]],
 ["Administración y emprendimiento","Tecnicatura o Licenciatura",["vender","negocio","emprender","organizar","dinero","liderar","comercio","marketing","cuentas","stock"],["Armá un mini emprendimiento de prueba.","Mirá la oferta de administración y contabilidad.","Preguntale a un comerciante qué le costó más."]],
 ["Turismo y gastronomía","Tecnicatura",["turismo","cocinar","viajar","hotel","comida","guia","cultura","tradicion","cocina","gastronomia"],["Averiguá tecnicaturas en turismo y gastronomía.","Hacé una pasantía o ayudá en un evento.","Armá una ruta turística de tu localidad."]],
 ["Diseño y comunicación","Tecnicatura o Licenciatura",["dibujar","disenar","arte","video","foto","musica","creativo","redes","editar","contenido"],["Armá un portfolio con 3 trabajos propios.","Probá un curso de diseño o edición.","Mirá carreras de diseño y comunicación."]],
 ["Ambiente y agro","Tecnicatura o Ingeniería",["ambiente","animal","naturaleza","agua","residuo","campo","planta","reciclar","cultivo","veterinaria"],["Sumate a una huerta o proyecto ambiental.","Mirá tecnicaturas agropecuarias y ambientales.","Hablá con un productor o técnico."]],
 ["Minería y geología","Tecnicatura o Ingeniería",["mineria","litio","geologia","piedra","energia","minerales","industria"],["Averiguá formaciones ligadas a minería en la provincia.","Visitá una charla o feria del sector.","Hablá con alguien que trabaje en el rubro."]],
 ["Derecho y gestión pública","Abogacía o Tecnicatura",["justicia","ley","debatir","politica","derecho","defender","gobierno","leyes"],["Asistí a una audiencia o charla abierta.","Mirá el plan de abogacía y gestión pública.","Hablá con alguien del ámbito judicial o municipal."]],
 ["Deporte y kinesiología","Profesorado, Tecnicatura o Licenciatura",["deporte","entrenar","cuerpo","futbol","movimiento","fisico","rehabilitacion","gimnasio"],["Ayudá a entrenar a un grupo de chicos.","Mirá profesorados y kinesiología.","Hablá con un entrenador o kinesiólogo."]]];

export const CAREERS = RAW.map(([nombre, tipo, claves, pasos]) => ({ nombre, tipo, claves, pasos }));
