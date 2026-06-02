import { Request, Response, NextFunction } from "express"
import { UserRole } from "../entities/User";
import { AppDataSource } from "../data-source";
import { News } from "../entities/News";

export const authorizeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Proveravamo da li je korisnik admin
  // Sta ako na primer korisnik dobije novu rolu admin? Lepsi primer slucaj statusa
  if(!req.role || req.role !== UserRole.ADMIN)
    return res.status(401).json({ code: 'NOT_AUTHORIZED' })
  
  console.log(req.role)
  // Ako je autorizacija uspešna, nastavljamo dalje
  next();
};

export const authorizeNews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const news_id = req.params.id as string
  const user_id = req.userId

  const newsRepository = AppDataSource.getRepository(News)
  const news = await newsRepository.findOne({
    where: { id: news_id },
    relations: { author: true }
  })

  if(!news) {
    return res.status(400).json({ code: 'NO_SUCH_ENTITY' })
  }

  if(news.author.id !== user_id && req.role !== UserRole.ADMIN) {
    return res.status(400).json({ code: 'NOT_YOURS' })
  }

  next();
}