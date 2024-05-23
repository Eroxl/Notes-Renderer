const mathJAXPreamble = String.raw`
\newcommand{\deriv}[2]{\frac{d#1}{d#2}}
\newcommand{\pderiv}[2]{\frac{\partial#1}{\partial#2}}
\newcommand{\at}[1]{\bigg|_{#1}}

\newcommand{\transpose}{\mathsf{T}}

\newcommand{\checked}[1]{\overset{\checkmark}{#1}}
\newcommand{\decreasing}[1]{\overset{\downarrow}{#1}}
\newcommand{\increasing}[1]{\overset{\uparrow}{#1}}

\newcommand{\ohm}{\Omega}
\newcommand{\degree}{^\circ}
\newcommand{\micro}{\mu}
`

export default mathJAXPreamble;
