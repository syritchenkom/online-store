// EN: We import 'jsonwebtoken' to use its JwtPayload type.
// PL: Importujemy 'jsonwebtoken', aby użyć jego typu JwtPayload.
import { JwtPayload } from 'jsonwebtoken';

// EN: This is the core of the solution: Declaration Merging.
// We are telling TypeScript that within the Express namespace,
// the Request interface should also have an optional 'user' property.
//
// PL: To jest sedno rozwiązania: Scalanie Deklaracji (Declaration Merging).
// Mówimy TypeScriptowi, że w przestrzeni nazw Express,
// interfejs Request powinien również mieć opcjonalną właściwość 'user'.
declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload | { id: number; email: string; role: string };
    }
  }
}
